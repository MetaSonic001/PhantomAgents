
// ===== FILE: src/action_verifier.cairo =====

#[starknet::contract]
mod ActionVerifier {
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use starknet::storage::{Map, StorageMapReadAccess, StorageMapWriteAccess};

    #[storage]
    struct Storage {
        proofs: Map<u256, ProofInfo>,
        proof_count: u256,
        agent_proof_count: Map<u256, u256>,
    }

    #[derive(Drop, Serde, starknet::Store)]
    pub struct ProofInfo {
        proof_id: u256,
        agent_id: u256,
        proof_hash: felt252,
        action_payload_hash: felt252,
        submitter: ContractAddress,
        timestamp: u64,
        verified: bool,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        ActionVerified: ActionVerified,
    }

    #[derive(Drop, starknet::Event)]
    struct ActionVerified {
        #[key]
        proof_id: u256,
        #[key]
        agent_id: u256,
        proof_hash: felt252,
        action_payload_hash: felt252,
        submitter: ContractAddress,
        timestamp: u64,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.proof_count.write(0);
    }

    #[abi(embed_v0)]
    impl ActionVerifierImpl of super::IActionVerifier<ContractState> {
        fn submit_action_proof(
            ref self: ContractState,
            agent_id: u256,
            proof_hash: felt252,
            action_payload_hash: felt252
        ) -> u256 {
            let caller = get_caller_address();
            let timestamp = get_block_timestamp();
            let proof_id = self.proof_count.read() + 1;

            let proof_info = ProofInfo {
                proof_id,
                agent_id,
                proof_hash,
                action_payload_hash,
                submitter: caller,
                timestamp,
                verified: true,
            };

            self.proofs.write(proof_id, proof_info);
            self.proof_count.write(proof_id);

            let agent_proofs = self.agent_proof_count.read(agent_id);
            self.agent_proof_count.write(agent_id, agent_proofs + 1);

            self.emit(ActionVerified {
                proof_id,
                agent_id,
                proof_hash,
                action_payload_hash,
                submitter: caller,
                timestamp,
            });

            proof_id
        }

        fn get_proof(self: @ContractState, proof_id: u256) -> ProofInfo {
            self.proofs.read(proof_id)
        }

        fn get_proof_count(self: @ContractState) -> u256 {
            self.proof_count.read()
        }

        fn get_agent_proof_count(self: @ContractState, agent_id: u256) -> u256 {
            self.agent_proof_count.read(agent_id)
        }

        fn verify_proof(self: @ContractState, proof_id: u256) -> bool {
            let proof = self.proofs.read(proof_id);
            proof.verified
        }
    }
}

#[starknet::interface]
trait IActionVerifier<TContractState> {
    fn submit_action_proof(
        ref self: TContractState,
        agent_id: u256,
        proof_hash: felt252,
        action_payload_hash: felt252
    ) -> u256;
    fn get_proof(self: @TContractState, proof_id: u256) -> ActionVerifier::ProofInfo;
    fn get_proof_count(self: @TContractState) -> u256;
    fn get_agent_proof_count(self: @TContractState, agent_id: u256) -> u256;
    fn verify_proof(self: @TContractState, proof_id: u256) -> bool;
}
