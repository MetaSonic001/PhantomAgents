
#[starknet::contract]
mod AgentRegistry {
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};

    #[storage]
    struct Storage {
        agents: Map<u256, AgentInfo>,
        agent_count: u256,
        owner_agents: Map<(ContractAddress, u256), u256>,
        owner_agent_count: Map<ContractAddress, u256>,
    }

    #[derive(Drop, Serde, starknet::Store)]
    pub struct AgentInfo {
        agent_id: u256,
        creator: ContractAddress,
        metadata_hash: felt252,
        capabilities_count: u32,
        created_at: u64,
        is_active: bool,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        AgentRegistered: AgentRegistered,
        AgentUpdated: AgentUpdated,
    }

    #[derive(Drop, starknet::Event)]
    struct AgentRegistered {
        #[key]
        agent_id: u256,
        #[key]
        creator: ContractAddress,
        metadata_hash: felt252,
        timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    struct AgentUpdated {
        #[key]
        agent_id: u256,
        metadata_hash: felt252,
        timestamp: u64,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.agent_count.write(0);
    }

    #[abi(embed_v0)]
    impl AgentRegistryImpl of super::IAgentRegistry<ContractState> {
        fn register_agent(
            ref self: ContractState,
            agent_id: u256,
            metadata_hash: felt252,
            capabilities_count: u32
        ) -> u256 {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();

            let agent_info = AgentInfo {
                agent_id,
                creator: caller,
                metadata_hash,
                capabilities_count,
                created_at: timestamp,
                is_active: true,
            };

            self.agents.write(agent_id, agent_info);
            
            // Track owner's agents
            let owner_count = self.owner_agent_count.read(caller);
            self.owner_agents.write((caller, owner_count), agent_id);
            self.owner_agent_count.write(caller, owner_count + 1);

            let total = self.agent_count.read();
            self.agent_count.write(total + 1);

            self.emit(AgentRegistered {
                agent_id,
                creator: caller,
                metadata_hash,
                timestamp,
            });

            agent_id
        }

        fn update_metadata_hash(
            ref self: ContractState,
            agent_id: u256,
            new_metadata_hash: felt252
        ) {
            let mut agent = self.agents.read(agent_id);
            let caller = get_caller_address();

            assert!(agent.creator == caller, "Not authorized");

            agent.metadata_hash = new_metadata_hash;
            self.agents.write(agent_id, agent);

            self.emit(AgentUpdated {
                agent_id,
                metadata_hash: new_metadata_hash,
                timestamp: get_block_timestamp(),
            });
        }

        fn get_agent(self: @ContractState, agent_id: u256) -> AgentInfo {
            self.agents.read(agent_id)
        }

        fn get_agent_count(self: @ContractState) -> u256 {
            self.agent_count.read()
        }

        fn get_owner_agent_count(self: @ContractState, owner: ContractAddress) -> u256 {
            self.owner_agent_count.read(owner)
        }

        fn get_owner_agent(self: @ContractState, owner: ContractAddress, index: u256) -> u256 {
            self.owner_agents.read((owner, index))
        }
    }
}

use starknet::ContractAddress;

#[starknet::interface]
trait IAgentRegistry<TContractState> {
    fn register_agent(
        ref self: TContractState,
        agent_id: u256,
        metadata_hash: felt252,
        capabilities_count: u32
    ) -> u256;
    fn update_metadata_hash(ref self: TContractState, agent_id: u256, new_metadata_hash: felt252);
    fn get_agent(self: @TContractState, agent_id: u256) -> AgentRegistry::AgentInfo;
    fn get_agent_count(self: @TContractState) -> u256;
    fn get_owner_agent_count(self: @TContractState, owner: ContractAddress) -> u256;
    fn get_owner_agent(self: @TContractState, owner: ContractAddress, index: u256) -> u256;
}
