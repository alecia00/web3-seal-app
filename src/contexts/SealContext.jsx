import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWalletContext } from './WalletContext';
import sealService from '../services/sealService';

const SealContext = createContext(null);

export const SealProvider = ({ children }) => {
  const { wallet, address, isConnected, suiClient } = useWalletContext();
  const [allowlists, setAllowlists] = useState([]);
  const [currentAllowlist, setCurrentAllowlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  // Load allowlists when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchAllowlists();
    } else {
      setAllowlists([]);
      setCurrentAllowlist(null);
    }
  }, [isConnected, address]);

  const fetchAllowlists = async () => {
    if (!isConnected || !address) {
      setError('Wallet not connected');
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      const lists = await sealService.getAllowlists(address, suiClient);
      setAllowlists(lists);
      return lists;
    } catch (error) {
      console.error('Error fetching allowlists:', error);
      setError('Failed to fetch allowlists: ' + error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createAllowlist = async (name) => {
    if (!isConnected || !wallet) {
      setError('Wallet not connected');
      return false;
    }

    try {
      setLoading(true);
      setTransactionInProgress(true);
      setError(null);

      const result = await sealService.createAllowlist(wallet, name, suiClient);
      
      if (result.success) {
        setLastTransaction({
          type: 'create',
          id: result.txId,
          timestamp: Date.now()
        });
        
        // Refresh the allowlists
        await fetchAllowlists();
        return true;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error creating allowlist:', error);
      setError('Failed to create allowlist: ' + error.message);
      return false;
    } finally {
      setLoading(false);
      setTransactionInProgress(false);
    }
  };

  const addMemberToAllowlist = async (allowlistId, memberAddress) => {
    if (!isConnected || !wallet) {
      setError('Wallet not connected');
      return false;
    }

    try {
      setLoading(true);
      setTransactionInProgress(true);
      setError(null);

      const result = await sealService.addMemberToAllowlist(
        wallet, 
        allowlistId, 
        memberAddress,
        suiClient
      );
      
      if (result.success) {
        setLastTransaction({
          type: 'addMember',
          id: result.txId,
          timestamp: Date.now()
        });
        
        // Refresh the allowlists
        await fetchAllowlists();
        return true;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error adding member to allowlist:', error);
      setError('Failed to add member: ' + error.message);
      return false;
    } finally {
      setLoading(false);
      setTransactionInProgress(false);
    }
  };

  const removeMemberFromAllowlist = async (allowlistId, memberAddress) => {
    if (!isConnected || !wallet) {
      setError('Wallet not connected');
      return false;
    }

    try {
      setLoading(true);
      setTransactionInProgress(true);
      setError(null);

      const result = await sealService.removeMemberFromAllowlist(
        wallet, 
        allowlistId, 
        memberAddress,
        suiClient
      );
      
      if (result.success) {
        setLastTransaction({
          type: 'removeMember',
          id: result.txId,
          timestamp: Date.now()
        });
        
        // Refresh the allowlists
        await fetchAllowlists();
        return true;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error removing member from allowlist:', error);
      setError('Failed to remove member: ' + error.message);
      return false;
    } finally {
      setLoading(false);
      setTransactionInProgress(false);
    }
  };

  const checkMembership = async (allowlistId, memberAddress) => {
    try {
      return await sealService.isMemberOfAllowlist(
        allowlistId, 
        memberAddress,
        suiClient
      );
    } catch (error) {
      console.error('Error checking membership:', error);
      return false;
    }
  };

  return (
    <SealContext.Provider
      value={{
        allowlists,
        currentAllowlist,
        loading,
        error,
        transactionInProgress,
        lastTransaction,
        createAllowlist,
        fetchAllowlists,
        addMemberToAllowlist,
        removeMemberFromAllowlist,
        checkMembership,
        setCurrentAllowlist,
      }}
    >
      {children}
    </SealContext.Provider>
  );
};

export const useSealContext = () => useContext(SealContext);

export default SealContext;
