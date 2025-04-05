/// Subscription module for Seal protocol
/// This module implements subscription-based access control
module seal::subscription {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::vector;
    use std::string::{Self, String};

    /// Error codes
    const ENotOwner: u64 = 0;
    const EInvalidPrice: u64 = 1;
    const EInvalidDuration: u64 = 2;
    const EInsufficientFunds: u64 = 3;
    const EExpiredSubscription: u64 = 4;

    /// Represents a subscription service
    struct SubscriptionService has key, store {
        id: UID,
        name: String,
        price: u64,
        duration: u64, // in minutes
        owner: address,
        created_at: u64
    }

    /// Represents a user's subscription
    struct Subscription has key, store {
        id: UID,
        service_id: address,
        user: address,
        purchased_at: u64,
        expires_at: u64
    }

    /// Event emitted when a new service is created
    struct ServiceCreated has copy, drop {
        service_id: address,
        name: String,
        price: u64,
        duration: u64,
        owner: address
    }

    /// Event emitted when a subscription is purchased
    struct SubscriptionPurchased has copy, drop {
        subscription_id: address,
        service_id: address,
        user: address,
        expires_at: u64
    }

    /// Event emitted when a subscription is renewed
    struct SubscriptionRenewed has copy, drop {
        subscription_id: address,
        new_expires_at: u64
    }

    /// Create a new subscription service
    public entry fun create_service(
        name: vector<u8>,
        price: u64,
        duration: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let owner = tx_context::sender(ctx);
        let service_id = object::new(ctx);
        let name_string = string::utf8(name);
        
        // Validate inputs
        assert!(price > 0, EInvalidPrice);
        assert!(duration > 0, EInvalidDuration);
        
        // Get current time
        let current_time = clock::timestamp_ms(clock);
        
        // Create the service object
        let service = SubscriptionService {
            id: service_id,
            name: name_string,
            price,
            duration,
            owner,
            created_at: current_time
        };
        
        // Emit the creation event
        event::emit(ServiceCreated {
            service_id: object::uid_to_address(&service.id),
            name: name_string,
            price,
            duration,
            owner
        });
        
        // Transfer the service to the owner
        transfer::share_object(service);
    }

    /// Purchase a subscription to a service
    public entry fun purchase_subscription(
        service: &SubscriptionService,
        payment: &mut Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let user = tx_context::sender(ctx);
        let subscription_id = object::new(ctx);
        
        // Check if payment is sufficient
        let price = service.price;
        assert!(coin::value(payment) >= price, EInsufficientFunds);
        
        // Get current time
        let current_time = clock::timestamp_ms(clock);
        
        // Calculate expiration time (current_time + duration in milliseconds)
        let expires_at = current_time + (service.duration * 60 * 1000);
        
        // Create the subscription object
        let subscription = Subscription {
            id: subscription_id,
            service_id: object::uid_to_address(&service.id),
            user,
            purchased_at: current_time,
            expires_at
        };
        
        // Transfer payment to service owner
        let paid = coin::split(payment, price, ctx);
        transfer::public_transfer(paid, service.owner);
        
        // Emit the purchase event
        event::emit(SubscriptionPurchased {
            subscription_id: object::uid_to_address(&subscription.id),
            service_id: object::uid_to_address(&service.id),
            user,
            expires_at
        });
        
        // Transfer the subscription to the user
        transfer::transfer(subscription, user);
    }

    /// Renew an existing subscription
    public entry fun renew_subscription(
        subscription: &mut Subscription,
        service: &SubscriptionService,
        payment: &mut Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let user = tx_context::sender(ctx);
        
        // Check if user owns the subscription
        assert!(user == subscription.user, ENotOwner);
        
        // Check if payment is sufficient
        let price = service.price;
        assert!(coin::value(payment) >= price, EInsufficientFunds);
        
        // Get current time
        let current_time = clock::timestamp_ms(clock);
        
        // Calculate new expiration time
        // If subscription is already expired, use current time as base
        let base_time = if (subscription.expires_at > current_time) {
            subscription.expires_at
        } else {
            current_time
        };
        
        // Add duration to base time
        let new_expires_at = base_time + (service.duration * 60 * 1000);
        
        // Update subscription
        subscription.expires_at = new_expires_at;
        
        // Transfer payment to service owner
        let paid = coin::split(payment, price, ctx);
        transfer::public_transfer(paid, service.owner);
        
        // Emit the renewal event
        event::emit(SubscriptionRenewed {
            subscription_id: object::uid_to_address(&subscription.id),
            new_expires_at
        });
    }

    /// Check if a subscription is valid (not expired)
    public fun is_valid(subscription: &Subscription, clock: &Clock): bool {
        let current_time = clock::timestamp_ms(clock);
        subscription.expires_at > current_time
    }

    /// Get the expiration time of a subscription
    public fun get_expiration(subscription: &Subscription): u64 {
        subscription.expires_at
    }

    /// Get the name of a service
    public fun name(service: &SubscriptionService): String {
        service.name
    }

    /// Get the price of a service
    public fun price(service: &SubscriptionService): u64 {
        service.price
    }

    /// Get the duration of a service (in minutes)
    public fun duration(service: &SubscriptionService): u64 {
        service.duration
    }

    /// Get the owner of a service
    public fun owner(service: &SubscriptionService): address {
        service.owner
    }
}
