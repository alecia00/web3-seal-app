# Seal Allowlist Contract

This contract implements the allowlist-based access control for the Seal protocol on Sui.

## Features

- Create allowlists with specified names
- Add members to allowlists
- Remove members from allowlists
- Check membership status

## Structure

The main object is `Allowlist`, which contains:
- A unique ID
- A name
- The owner's address
- A table of member addresses

## Functions

- `create_allowlist`: Create a new allowlist with the caller as owner and first member
- `add_member`: Add a new member to an allowlist (owner only)
- `remove_member`: Remove a member from an allowlist (owner only)
- `is_member`: Check if an address is a member of an allowlist

## Events

- `AllowlistCreated`: Emitted when a new allowlist is created
- `MemberAdded`: Emitted when a member is added to an allowlist
- `MemberRemoved`: Emitted when a member is removed from an allowlist

## Usage

```move
// Create a new allowlist
seal::allowlist::create_allowlist(b"My Allowlist", ctx);

// Add a member
seal::allowlist::add_member(&mut allowlist, member_address, ctx);

// Remove a member
seal::allowlist::remove_member(&mut allowlist, member_address, ctx);

// Check membership
let is_member = seal::allowlist::is_member(&allowlist, address);
```
