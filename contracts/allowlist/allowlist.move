/// Allowlist module for Seal protocol
/// This module implements allowlist-based access control
module seal::allowlist {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};
    use sui::event;
    use std::vector;
    use std::string::{Self, String};

    /// Error codes
    const ENotOwner: u64 = 0;
    const EAlreadyInAllowlist: u64 = 1;
    const ENotInAllowlist: u64 = 2;

    /// Represents an allowlist with its members
    struct Allowlist has key, store {
        id: UID,
        name: String,
        owner: address,
        members: Table<address, bool>
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
    public entry fun create_allowlist(
        name: vector<u8>,
        ctx: &mut TxContext
    ) {
        let owner = tx_context::sender(ctx);
        let allowlist_id = object::new(ctx);
        let name_string = string::utf8(name);
        
        // Create a new table for members
        let members = table::new<address, bool>(ctx);
        
        // Add owner as the first member
        table::add(&mut members, owner, true);
        
        // Create the allowlist object
        let allowlist = Allowlist {
            id: allowlist_id,
            name: name_string,
            owner,
            members
        };
        
        // Emit the creation event
        event::emit(AllowlistCreated {
            allowlist_id: object::uid_to_address(&allowlist.id),
            name: name_string,
            owner
        });
        
        // Transfer the allowlist to the owner
        transfer::share_object(allowlist);
    }

    /// Add a member to an allowlist
    public entry fun add_member(
        allowlist: &mut Allowlist,
        member: address,
        ctx: &mut TxContext
    ) {
        // Only the owner can add members
        let sender = tx_context::sender(ctx);
        assert!(sender == allowlist.owner, ENotOwner);
        
        // Check if member is already in the allowlist
        assert!(!table::contains(&allowlist.members, member), EAlreadyInAllowlist);
        
        // Add member to the allowlist
        table::add(&mut allowlist.members, member, true);
        
        // Emit the member added event
        event::emit(MemberAdded {
            allowlist_id: object::uid_to_address(&allowlist.id),
            member
        });
    }

    /// Remove a member from an allowlist
    public entry fun remove_member(
        allowlist: &mut Allowlist,
        member: address,
        ctx: &mut TxContext
    ) {
        // Only the owner can remove members
        let sender = tx_context::sender(ctx);
        assert!(sender == allowlist.owner, ENotOwner);
        
        // Check if member is in the allowlist
        assert!(table::contains(&allowlist.members, member), ENotInAllowlist);
        
        // Remove member from the allowlist
        table::remove(&mut allowlist.members, member);
        
        // Emit the member removed event
        event::emit(MemberRemoved {
            allowlist_id: object::uid_to_address(&allowlist.id),
            member
        });
    }

    /// Check if an address is a member of an allowlist
    public fun is_member(allowlist: &Allowlist, member: address): bool {
        table::contains(&allowlist.members, member)
    }

    /// Get the name of an allowlist
    public fun name(allowlist: &Allowlist): String {
        allowlist.name
    }

    /// Get the owner of an allowlist
    public fun owner(allowlist: &Allowlist): address {
        allowlist.owner
    }
}
