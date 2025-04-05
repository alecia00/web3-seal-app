/// Utils module for Seal protocol
/// This module contains shared utilities for Seal protocol
module seal::utils {
    use sui::clock::{Self, Clock};
    use std::string::{Self, String};
    use std::ascii::{Self, String as AsciiString};
    use std::vector;

    /// Calculate expiration time from current time and duration
    public fun calculate_expiration(
        clock: &Clock,
        duration_minutes: u64
    ): u64 {
        let current_time = clock::timestamp_ms(clock);
        // Convert minutes to milliseconds and add to current time
        current_time + (duration_minutes * 60 * 1000)
    }

    /// Format an address for display
    /// Returns a shortened version like "0xab...cd"
    public fun format_address(addr: address): String {
        let addr_bytes = std::address::to_bytes(addr);
        let prefix = vector::empty<u8>();
        let suffix = vector::empty<u8>();
        
        // Add "0x" prefix
        vector::push_back(&mut prefix, 48); // '0'
        vector::push_back(&mut prefix, 120); // 'x'
        
        // Add first 4 bytes
        let i = 0;
        while (i < 4 && i < vector::length(&addr_bytes)) {
            vector::push_back(&mut prefix, *vector::borrow(&addr_bytes, i));
            i = i + 1;
        };
        
        // Add "..." separator
        let separator = vector::empty<u8>();
        vector::push_back(&mut separator, 46); // '.'
        vector::push_back(&mut separator, 46); // '.'
        vector::push_back(&mut separator, 46); // '.'
        
        // Add last 4 bytes
        let len = vector::length(&addr_bytes);
        let j = if (len > 4) { len - 4 } else { 0 };
        while (j < len) {
            vector::push_back(&mut suffix, *vector::borrow(&addr_bytes, j));
            j = j + 1;
        };
        
        // Combine all parts
        let result = vector::empty<u8>();
        vector::append(&mut result, prefix);
        vector::append(&mut result, separator);
        vector::append(&mut result, suffix);
        
        string::utf8(result)
    }

    /// Convert milliseconds to a human-readable duration string
    public fun format_duration(milliseconds: u64): String {
        let seconds = milliseconds / 1000;
        let minutes = seconds / 60;
        let hours = minutes / 60;
        let days = hours / 24;
        
        if (days > 0) {
            let days_str = std::ascii::string(std::vector::singleton(48 + (days as u8)));
            let suffix = if (days == 1) { string::utf8(b" day") } else { string::utf8(b" days") };
            string::append(string::from_ascii(days_str), suffix)
        } else if (hours > 0) {
            let hours_str = std::ascii::string(std::vector::singleton(48 + (hours as u8)));
            let suffix = if (hours == 1) { string::utf8(b" hour") } else { string::utf8(b" hours") };
            string::append(string::from_ascii(hours_str), suffix)
        } else if (minutes > 0) {
            let minutes_str = std::ascii::string(std::vector::singleton(48 + (minutes as u8)));
            let suffix = if (minutes == 1) { string::utf8(b" minute") } else { string::utf8(b" minutes") };
            string::append(string::from_ascii(minutes_str), suffix)
        } else {
            let seconds_str = std::ascii::string(std::vector::singleton(48 + (seconds as u8)));
            let suffix = if (seconds == 1) { string::utf8(b" second") } else { string::utf8(b" seconds") };
            string::append(string::from_ascii(seconds_str), suffix)
        }
    }
}
