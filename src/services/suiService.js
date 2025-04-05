/**
 * Sui blockchain interaction service
 * 
 * This file contains functions for interacting with the Sui blockchain.
 * In a production app, these would use the Sui SDK to create and send 
 * transactions to the blockchain.
 * 
 * For this demo, we'll create simplified versions that primarily use
 * localStorage to simulate blockchain interactions.
 */

/**
 * Creates a new allowlist on the blockchain
 * 
 * @param {string} name - Name of the allowlist
 * @param {string} creator - Creator's wallet address
 * @param {Function} executeTransaction - Function to execute a transaction
 * @returns {Promise<string>} ID of the created allowlist
 */
export const createAllowlist = async (name, creator, executeTransaction) => {
  try {
    // In a real implementation, this would create a Move transaction
    // For demo purposes, we'll use localStorage
    
    // Create allowlist object
    const allowlistId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const allowlist = {
      id: allowlistId,
      name,
      members: [creator], // Start with just the creator
      creator,
      createdAt: Date.now(),
    };
    
    // Get existing allowlists
    const allowlistsString = localStorage.getItem(`seal_allowlists_${creator}`);
    const allowlists = allowlistsString ? JSON.parse(allowlistsString) : [];
    
    // Add new allowlist
    allowlists.push(allowlist);
    
    // Save allowlists
    localStorage.setItem(`seal_allowlists_${creator}`, JSON.stringify(allowlists));
    
    return allowlistId;
  } catch (error) {
    console.error('Error creating allowlist:', error);
    throw new Error('Failed to create allowlist');
  }
};

/**
 * Adds members to an allowlist
 * 
 * @param {string} allowlistId - ID of the allowlist
 * @param {Array<string>} members - Array of wallet addresses to add
 * @param {Function} executeTransaction - Function to execute a transaction
 * @returns {Promise<boolean>} Success status
 */
export const addToAllowlist = async (allowlistId, members, executeTransaction) => {
  try {
    // In a real implementation, this would create a Move transaction
    // For demo purposes, we'll use localStorage
    
    // Get current user's wallet address from localStorage (simulating transaction context)
    const currentUser = localStorage.getItem('current_wallet_address');
    if (!currentUser) {
      throw new Error('No wallet connected');
    }
    
    // Get allowlists
    const allowlistsString = localStorage.getItem(`seal_allowlists_${currentUser}`);
    if (!allowlistsString) {
      throw new Error('No allowlists found');
    }
    
    const allowlists = JSON.parse(allowlistsString);
    
    // Find the allowlist
    const allowlistIndex = allowlists.findIndex(a => a.id === allowlistId);
    if (allowlistIndex === -1) {
      throw new Error('Allowlist not found');
    }
    
    // Check if user is creator
    if (allowlists[allowlistIndex].creator !== currentUser) {
      throw new Error('Only the creator can modify the allowlist');
    }
    
    // Update members (avoid duplicates)
    const existingMembers = new Set(allowlists[allowlistIndex].members);
    members.forEach(member => existingMembers.add(member));
    
    allowlists[allowlistIndex].members = Array.from(existingMembers);
    
    // Save allowlists
    localStorage.setItem(`seal_allowlists_${currentUser}`, JSON.stringify(allowlists));
    
    return true;
  } catch (error) {
    console.error('Error adding to allowlist:', error);
    throw new Error('Failed to add to allowlist');
  }
};

/**
 * Removes members from an allowlist
 * 
 * @param {string} allowlistId - ID of the allowlist
 * @param {Array<string>} members - Array of wallet addresses to remove
 * @param {Function} executeTransaction - Function to execute a transaction
 * @returns {Promise<boolean>} Success status
 */
export const removeFromAllowlist = async (allowlistId, members, executeTransaction) => {
  try {
    // In a real implementation, this would create a Move transaction
    // For demo purposes, we'll use localStorage
    
    // Get current user's wallet address from localStorage (simulating transaction context)
    const currentUser = localStorage.getItem('current_wallet_address');
    if (!currentUser) {
      throw new Error('No wallet connected');
    }
    
    // Get allowlists
    const allowlistsString = localStorage.getItem(`seal_allowlists_${currentUser}`);
    if (!allowlistsString) {
      throw new Error('No allowlists found');
    }
    
    const allowlists = JSON.parse(allowlistsString);
    
    // Find the allowlist
    const allowlistIndex = allowlists.findIndex(a => a.id === allowlistId);
    if (allowlistIndex === -1) {
      throw new Error('Allowlist not found');
    }
    
    // Check if user is creator
    if (allowlists[allowlistIndex].creator !== currentUser) {
      throw new Error('Only the creator can modify the allowlist');
    }
    
    // Creator cannot remove themselves
    const membersToRemove = members.filter(m => m !== currentUser);
    
    // Update members
    allowlists[allowlistIndex].members = allowlists[allowlistIndex].members.filter(
      m => !membersToRemove.includes(m)
    );
    
    // Save allowlists
    localStorage.setItem(`seal_allowlists_${currentUser}`, JSON.stringify(allowlists));
    
    return true;
  } catch (error) {
    console.error('Error removing from allowlist:', error);
    throw new Error('Failed to remove from allowlist');
  }
};

/**
 * Creates a subscription service
 * 
 * @param {string} name - Name of the service
 * @param {number} price - Price in MIST
 * @param {number} duration - Duration in minutes
 * @param {string} creator - Creator's wallet address
 * @param {Function} executeTransaction - Function to execute a transaction
 * @returns {Promise<string>} ID of the created service
 */
export const createSubscriptionService = async (
  name, 
  price, 
  duration, 
  creator, 
  executeTransaction
) => {
  try {
    // In a real implementation, this would create a Move transaction
    // For demo purposes, we'll use localStorage
    
    // Create service object
    const serviceId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const service = {
      id: serviceId,
      name,
      price,
      duration,
      creator,
      createdAt: Date.now(),
    };
    
    // Get existing services
    const servicesString = localStorage.getItem(`seal_services_${creator}`);
    const services = servicesString ? JSON.parse(servicesString) : [];
    
    // Add new service
    services.push(service);
    
    // Save services
    localStorage.setItem(`seal_services_${creator}`, JSON.stringify(services));
    
    return serviceId;
  } catch (error) {
    console.error('Error creating subscription service:', error);
    throw new Error('Failed to create subscription service');
  }
};

/**
 * Purchases a subscription
 * 
 * @param {string} serviceId - ID of the service
 * @param {string} buyer - Buyer's wallet address
 * @param {Function} executeTransaction - Function to execute a transaction
 * @returns {Promise<string>} ID of the created subscription
 */
export const purchaseSubscription = async (serviceId, buyer, executeTransaction) => {
  try {
    // In a real implementation, this would create a Move transaction
    // For demo purposes, we'll use localStorage
    
    // Get service
    const services = [];
    
    // Collect all services from all users (in a real app, this would be a blockchain query)
    const allKeys = Object.keys(localStorage);
    const serviceKeys = allKeys.filter(key => key.startsWith('seal_services_'));
    
    for (const key of serviceKeys) {
      const userServices = JSON.parse(localStorage.getItem(key) || '[]');
      services.push(...userServices);
    }
    
    // Find the service
    const service = services.find(s => s.id === serviceId);
    if (!service) {
      throw new Error('Service not found');
    }
    
    // Create subscription object
    const subscriptionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const subscription = {
      id: subscriptionId,
      serviceId,
      user: buyer,
      purchasedAt: Date.now(),
      expiresAt: Date.now() + (service.duration * 60 * 1000), // Convert minutes to ms
    };
    
    // Get existing subscriptions
    const subscriptionsString = localStorage.getItem(`seal_subscriptions_${buyer}`);
    const subscriptions = subscriptionsString ? JSON.parse(subscriptionsString) : [];
    
    // Add new subscription
    subscriptions.push(subscription);
    
    // Save subscriptions
    localStorage.setItem(`seal_subscriptions_${buyer}`, JSON.stringify(subscriptions));
    
    return subscriptionId;
  } catch (error) {
    console.error('Error purchasing subscription:', error);
    throw new Error('Failed to purchase subscription');
  }
};
