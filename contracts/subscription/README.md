# Seal Subscription Contract

This contract implements the subscription-based access control for the Seal protocol on Sui.

## Features

- Create subscription services with specified prices and durations
- Purchase subscriptions using MIST (Sui's native token)
- Check subscription validity based on expiration time
- Renew existing subscriptions

## Structure

The main objects are:
- `SubscriptionService`: Defines a service with its price and duration
- `Subscription`: Represents a user's subscription with expiration time

## Functions

- `create_service`: Create a new subscription service
- `purchase_subscription`: Purchase a subscription to a service
- `renew_subscription`: Renew an existing subscription
- `is_valid`: Check if a subscription is valid (not expired)
- `get_expiration`: Get the expiration time of a subscription

## Events

- `ServiceCreated`: Emitted when a new service is created
- `SubscriptionPurchased`: Emitted when a subscription is purchased
- `SubscriptionRenewed`: Emitted when a subscription is renewed

## Usage

```move
// Create a new subscription service
// Price: 1000 MIST, Duration: 60 minutes
seal::subscription::create_service(b"Premium Access", 1000, 60, ctx);

// Purchase a subscription
seal::subscription::purchase_subscription(&service, ctx);

// Check if a subscription is valid
let is_valid = seal::subscription::is_valid(&subscription);
```
