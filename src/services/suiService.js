import { JsonRpcProvider, Connection } from '@mysten/sui.js';

const TESTNET_URL = 'https://fullnode.testnet.sui.io/';
const provider = new JsonRpcProvider(new Connection({
  fullnode: TESTNET_URL,
}));

const suiService = {
  // Get connected wallet account
  getAccount: async (wallet) => {
    if (!wallet.connected) throw new Error('Wallet not connected');
    return wallet.account;
  },

  // Create an allowlist entry
  createAllowlist: async (wallet, name) => {
    try {
      if (!wallet.connected) throw new Error('Wallet not connected');
      
      // In a real implementation, you would:
      // 1. Build a transaction to call your allowlist contract
      // 2. Sign it with the wallet
      // 3. Execute the transaction
      // 4. Return the transaction results
      
      // For now, we're mocking the response
      console.log(`Creating allowlist: ${name}`);
      
      // This would be where you would interact with your smart contract
      return {
        success: true,
        transactionId: `mock-tx-${Date.now()}`,
        allowlistId: `allowlist-${Date.now()}`
      };
    } catch (error) {
      console.error('Error creating allowlist:', error);
      throw error;
    }
  },

  // Get all allowlists for a user
  getAllowlists: async (wallet) => {
    try {
      if (!wallet.connected) throw new Error('Wallet not connected');

      // In a real implementation, you would query your smart contract
      // For now, return mock data
      return [
        {
          id: 'allowlist-1',
          name: 'Premium Content',
          members: ['0x123', '0x456']
        },
        {
          id: 'allowlist-2',
          name: 'VIP Access',
          members: ['0x789']
        }
      ];
    } catch (error) {
      console.error('Error fetching allowlists:', error);
      throw error;
    }
  },

  // Add member to allowlist
  addMemberToAllowlist: async (wallet, allowlistId, memberAddress) => {
    try {
      if (!wallet.connected) throw new Error('Wallet not connected');

      // Mock implementation
      console.log(`Adding ${memberAddress} to allowlist ${allowlistId}`);
      return {
        success: true,
        transactionId: `mock-tx-${Date.now()}`
      };
    } catch (error) {
      console.error('Error adding member to allowlist:', error);
      throw error;
    }
  }
};

export default suiService;
