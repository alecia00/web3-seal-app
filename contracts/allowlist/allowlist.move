module seal::allowlist {
    use std::string::{Self, String};
    use std::vector;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::vec_set::{Self, VecSet};
    use sui::event;

    /// Error codes
    const ENotOwner: u64 = 0;
    const EMemberAlreadyExists: u64 = 1;
    const EMemberNotFound: u64 = 2;

    /// The main Allowlist object that stores members
    struct Allowlist has key, store {
        id: UID,
        name: String,
        owner: address,
        members: VecSet<address>
    }

    /// Event emitted when a new allowlist is created
    struct AllowlistCreated has copy, drop {
        allowlist_id: address,
        name: String,
        owner: address
    }

    /// Event emitted when a member is added to an allowlist
    struct MemberAdded has copy, drop {
        allowlist_id: address,
        member: address
    }

    /// Event emitted when a member is removed from an allowlist
    struct MemberRemoved has copy, drop {
        allowlist_id: address,
        member: address
    }

    /// Create a new allowlist
    public entry fun create_allowlist_entry(
        name: vector<u8>,
        ctx: &mut TxContext
    ) {
        let allowlist = create_allowlist(name, ctx);
        transfer::transfer(allowlist, tx_context::sender(ctx));
    }

    /// Internal function to create an allowlist
    fun create_allowlist(
        name: vector<u8>,
        ctx: &mut TxContext
    ): Allowlist {
        let name_string = string::utf8(name);
        let owner = tx_context::sender(ctx);
        let id = object::new(ctx);
        let allowlist_id = object::uid_to_address(&id);
        
        // Create empty members set
        let members = vec_set::empty();
        
        // Emit creation event
        event::emit(AllowlistCreated {
            allowlist_id,
            name: name_string,
            owner
        });
        
        Allowlist {
            id,
            name: name_string,
            owner,
            members
        }
    }

    /// Add a member to the allowlist
    public entry fun add_member(
        allowlist: &mut Allowlist,
        member: address,
        ctx: &TxContext
    ) {
        // Only owner can add members
        assert!(tx_context::sender(ctx) == allowlist.owner, ENotOwner);
        
        // Check if member already exists
        assert!(!vec_set::contains(&allowlist.members, &member), EMemberAlreadyExists);
        
        // Add the member
        vec_set::insert(&mut allowlist.members, member);
        
        // Emit event
        event::emit(MemberAdded {
            allowlist_id: object::uid_to_address(&allowlist.id),
            member
        });
    }

    /// Remove a member from the allowlist
    public entry fun remove_member(
        allowlist: &mut Allowlist,
        member: address,
        ctx: &TxContext
    ) {
        // Only owner can remove members
        assert!(tx_context::sender(ctx) == allowlist.owner, ENotOwner);
        
        // Check if member exists
        assert!(vec_set::contains(&allowlist.members, &member), EMemberNotFound);
        
        // Remove the member
        vec_set::remove(&mut allowlist.members, &member);
        
        // Emit event
        event::emit(MemberRemoved {
            allowlist_id: object::uid_to_address(&allowlist.id),
            member
        });
    }

    /// Check if an address is a member of the allowlist
    public fun is_member(allowlist: &Allowlist, member: address): bool {
        vec_set::contains(&allowlist.members, &member)
    }

    /// Get the name of the allowlist
    public fun name(allowlist: &Allowlist): &String {
        &allowlist.name
    }

    /// Get the owner of the allowlist
    public fun owner(allowlist: &Allowlist): address {
        allowlist.owner
    }

    /// Get the members count
    public fun members_count(allowlist: &Allowlist): u64 {
        vec_set::size(&allowlist.members)
    }

    #[test]
    fun test_create_allowlist() {
        use sui::test_scenario;

        let owner = @0xCAFE;
        let member = @0xFACE;

        let scenario_val = test_scenario::begin(owner);
        let scenario = &mut scenario_val;
        
        // Create an allowlist
        test_scenario::next_tx(scenario, owner);
        {
            create_allowlist_entry(b"Test Allowlist", test_scenario::ctx(scenario));
        };

        // Verify allowlist was created and add a member
        test_scenario::next_tx(scenario, owner);
        {
            let allowlist = test_scenario::take_from_sender<Allowlist>(scenario);
            assert!(name(&allowlist) == &string::utf8(b"Test Allowlist"), 0);
            assert!(owner(&allowlist) == owner, 0);
            assert!(members_count(&allowlist) == 0, 0);
            
            // Add a member
            add_member(&mut allowlist, member, test_scenario::ctx(scenario));
            assert!(members_count(&allowlist) == 1, 0);
            assert!(is_member(&allowlist, member), 0);
            
            test_scenario::return_to_sender(scenario, allowlist);
        };

        // Remove a member
        test_scenario::next_tx(scenario, owner);
        {
            let allowlist = test_scenario::take_from_sender<Allowlist>(scenario);
            
            // Verify member exists and remove
            assert!(is_member(&allowlist, member), 0);
            remove_member(&mut allowlist, member, test_scenario::ctx(scenario));
            
            // Verify member was removed
            assert!(members_count(&allowlist) == 0, 0);
            assert!(!is_member(&allowlist, member), 0);
            
            test_scenario::return_to_sender(scenario, allowlist);
        };

        test_scenario::end(scenario_val);
    }
}
