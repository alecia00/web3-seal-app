import { TransactionBlock } from '@mysten/sui/transactions';

const PACKAGE_ID = '0x'; // Replace with your deployed package ID for testnet
const ALLOWLIST_MODULE = 'allowlist';

// Service for interacting with Seal protocol on Sui blockchain
const sealService = {
  // Create a new allowlist
  createAllowlist: async (wallet, name, suiClient) => {
    try {
      // Create a transaction block
      const tx = new TransactionBlock();
      
      // Call the create_allowlist function from the allowlist module
      tx.moveCall({
        target: `${PACKAGE_ID}::${ALLOWLIST_MODULE}::create_allowlist_entry`,
        arguments: [
          tx.pure.string(name)
        ],
      });
      
      // Sign and execute the transaction
      const { bytes, signature } = await wallet.signTransactionBlock({
        transactionBlock: tx,
      });
      
      const response = await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });
      
      return {
        success: true,
        txId: response.digest,
        effects: response.effects,
      };
    } catch (error) {
      console.error('Error creating allowlist:', error);
      throw error;
    }
  },
  
  // Get all allowlists for the connected wallet
  getAllowlists: async (address, suiClient) => {
    try {
      // Query the owner's objects
      const ownedObjects = await suiClient.getOwnedObjects({
        owner: address,
        options: {
          showContent: true,
          showType: true,
        },
      });
      
      // Filter for allowlist objects
      const allowlists = ownedObjects.data
        .filter(obj => obj.data.type && obj.data.type.includes(`${PACKAGE_ID}::${ALLOWLIST_MODULE}::Allowlist`))
        .map(obj => {
          const content = obj.data.content;
          return {
            id: obj.data.objectId,
            name: content.fields.name,
            members: content.fields.members.fields.contents || [],
            owner: address
          };
        });
      
      return allowlists;
    } catch (error) {
      console.error('Error fetching allowlists:', error);
      throw error;
    }
  },
  
  // Add a member to an allowlist
  addMemberToAllowlist: async (wallet, allowlistId, memberAddress, suiClient) => {
    try {
      const tx = new TransactionBlock();
      
      // Call the add_member function
      tx.moveCall({
        target: `${PACKAGE_ID}::${ALLOWLIST_MODULE}::add_member`,
        arguments: [
          tx.object(allowlistId),
          tx.pure.address(memberAddress)
        ],
      });
      
      // Sign and execute the transaction
      const { bytes, signature } = await wallet.signTransactionBlock({
        transactionBlock: tx,
      });
      
      const response = await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showEffects: true,
        },
      });
      
      return {
        success: true,
        txId: response.digest,
        effects: response.effects,
      };
    } catch (error) {
      console.error('Error adding member to allowlist:', error);
      throw error;
    }
  },
  
  // Check if an address is a member of an allowlist
  isMemberOfAllowlist: async (allowlistId, memberAddress, suiClient) => {
    try {
      const tx = new TransactionBlock();
      
      // Call is_member function (read-only)
      tx.moveCall({
        target: `${PACKAGE_ID}::${ALLOWLIST_MODULE}::is_member`,
        arguments: [
          tx.object(allowlistId),
          tx.pure.address(memberAddress)
        ],
      });
      
      const response = await suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: memberAddress,
      });
      
      // Parse the response
      if (response.results && response.results[0]) {
        const returnValue = response.results[0].returnValues[0];
        return returnValue === '1'; // Convert to boolean
      }
      
      return false;
    } catch (error) {
      console.error('Error checking membership:', error);
      return false;
    }
  },
  
  // Remove a member from an allowlist
  removeMemberFromAllowlist: async (wallet, allowlistId, memberAddress, suiClient) => {
    try {
      const tx = new TransactionBlock();
      
      // Call the remove_member function
      tx.moveCall({
        target: `${PACKAGE_ID}::${ALLOWLIST_MODULE}::remove_member`,
        arguments: [
          tx.object(allowlistId),
          tx.pure.address(memberAddress)
        ],
      });
      
      // Sign and execute the transaction
      const { bytes, signature } = await wallet.signTransactionBlock({
        transactionBlock: tx,
      });
      
      const response = await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showEffects: true,
        },
      });
      
      return {
        success: true,
        txId: response.digest,
        effects: response.effects,
      };
    } catch (error) {
      console.error('Error removing member from allowlist:', error);
      throw error;
    }
  }
};

export default sealService;
