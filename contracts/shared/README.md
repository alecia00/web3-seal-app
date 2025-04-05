# Seal Shared Utilities

This package contains shared utilities used by both the allowlist and subscription contracts of the Seal protocol.

## Features

- Common data structures and types
- Time utilities for subscription duration calculations
- Verification utilities for signatures and access control

## Functions

- `verify_signature`: Verify a signature against a message and address
- `calculate_expiration`: Calculate expiration time based on duration
- `format_address`: Format an address for display

## Usage

```move
// Import the utilities
use seal::utils;

// Verify a signature
let is_valid = utils::verify_signature(sig, msg, address);

// Calculate expiration time
let expiration = utils::calculate_expiration(duration_minutes);
```
