
// ===== FILE: src/marketplace.cairo =====

#[starknet::contract]
mod Marketplace {
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};

    #[storage]
    struct Storage {
        listings: Map<u256, Listing>,
        listing_count: u256,
        subscriptions: Map<(u256, ContractAddress), bool>,
        agent_revenue: Map<u256, u256>,
    }

    #[derive(Drop, Serde, starknet::Store)]
    pub struct Listing {
        listing_id: u256,
        agent_id: u256,
        creator: ContractAddress,
        price: u256,
        is_active: bool,
        created_at: u64,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        AgentListed: AgentListed,
        Subscribed: Subscribed,
        RevenueWithdrawn: RevenueWithdrawn,
    }

    #[derive(Drop, starknet::Event)]
    struct AgentListed {
        #[key]
        listing_id: u256,
        #[key]
        agent_id: u256,
        creator: ContractAddress,
        price: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct Subscribed {
        #[key]
        listing_id: u256,
        #[key]
        subscriber: ContractAddress,
        price: u256,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct RevenueWithdrawn {
        #[key]
        agent_id: u256,
        creator: ContractAddress,
        amount: u256,
        timestamp: u64,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.listing_count.write(0);
    }

    #[abi(embed_v0)]
    impl MarketplaceImpl of super::IMarketplace<ContractState> {
        fn list_agent(
            ref self: ContractState,
            agent_id: u256,
            price: u256
        ) -> u256 {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();
            let listing_id = self.listing_count.read() + 1;

            let listing = Listing {
                listing_id,
                agent_id,
                creator: caller,
                price,
                is_active: true,
                created_at: timestamp,
            };

            self.listings.write(listing_id, listing);
            self.listing_count.write(listing_id);

            self.emit(AgentListed {
                listing_id,
                agent_id,
                creator: caller,
                price,
                timestamp,
            });

            listing_id
        }

        fn subscribe(
            ref self: ContractState,
            listing_id: u256
        ) {
            let caller = get_caller_address();
            let listing = self.listings.read(listing_id);
            
            assert!(listing.is_active, "Listing not active");

            self.subscriptions.write((listing_id, caller), true);
            
            let current_revenue = self.agent_revenue.read(listing.agent_id);
            self.agent_revenue.write(listing.agent_id, current_revenue + listing.price);

            self.emit(Subscribed {
                listing_id,
                subscriber: caller,
                price: listing.price,
                timestamp: get_block_timestamp(),
            });
        }

        fn withdraw_revenue(
            ref self: ContractState,
            agent_id: u256
        ) -> u256 {
            let caller = get_caller_address();
            let revenue = self.agent_revenue.read(agent_id);
            
            assert!(revenue > 0, "No revenue to withdraw");

            self.agent_revenue.write(agent_id, 0);

            self.emit(RevenueWithdrawn {
                agent_id,
                creator: caller,
                amount: revenue,
                timestamp: get_block_timestamp(),
            });

            revenue
        }

        fn get_listing(self: @ContractState, listing_id: u256) -> Listing {
            self.listings.read(listing_id)
        }

        fn is_subscribed(
            self: @ContractState,
            listing_id: u256,
            user: ContractAddress
        ) -> bool {
            self.subscriptions.read((listing_id, user))
        }

        fn get_agent_revenue(self: @ContractState, agent_id: u256) -> u256 {
            self.agent_revenue.read(agent_id)
        }

        fn get_listing_count(self: @ContractState) -> u256 {
            self.listing_count.read()
        }
    }
}

use starknet::ContractAddress;

#[starknet::interface]
trait IMarketplace<TContractState> {
    fn list_agent(ref self: TContractState, agent_id: u256, price: u256) -> u256;
    fn subscribe(ref self: TContractState, listing_id: u256);
    fn withdraw_revenue(ref self: TContractState, agent_id: u256) -> u256;
    fn get_listing(self: @TContractState, listing_id: u256) -> Marketplace::Listing;
    fn is_subscribed(self: @TContractState, listing_id: u256, user: ContractAddress) -> bool;
    fn get_agent_revenue(self: @TContractState, agent_id: u256) -> u256;
    fn get_listing_count(self: @TContractState) -> u256;
}
