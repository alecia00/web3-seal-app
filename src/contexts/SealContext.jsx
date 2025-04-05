import React, { createContext, useContext, useState } from 'react';
import { useWalletContext } from './WalletContext';

const SealContext = createContext(null);

export const SealProvider = ({ children }) => {
  const { wallet, address, isConnected } = useWalletContext();
  const [allowlists, setAllowlists] = useState([]);
  const [currentAllowlist, setCurrentAllowlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  const fetchAllowlists = async () => {
    if (!isConnected || !address) {
      setError('Wallet not connected');
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      // For demo, simulate API call
      setTimeout(() => {
        const mockAllowlists = [
          {
            id: "0x" + Math.random().toString(16).substring(2, 42),
            name: "Premium Content",
            members: ["0x1234...5678", "0x8765...4321"],
            owner: address
          },
          {
            id: "0x" + Math.random().toString(16).substring(2, 42),
            name: "VIP Access",
            members: [],
            owner: address
          }
        ];
        
        setAllowlists(mockAllowlists);
        setLoading(false);
      }, 1000);
      
      return [];
    } catch (error) {
      console.error('Error fetching allowlists:', error);
      setError('Failed to fetch allowlists: ' + error.message);
      setLoading(false);
      return [];
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

      // Simulate transaction
      return new Promise((resolve) => {
        setTimeout(() => {
          const newAllowlist = {
            id: "0x" + Math.random().toString(16).substring(2, 42),
            name,
            members: [],
            owner: address
          };
          
          setAllowlists([...allowlists, newAllowlist]);
          setLastTransaction({
            type: 'create',
            id: "0x" + Math.random().toString(16).substring(2, 42),
            timestamp: Date.now()
          });
          
          setLoading(false);
          setTransactionInProgress(false);
          resolve(true);
        }, 2000);
      });
    } catch (error) {
      console.error('Error creating allowlist:', error);
      setError('Failed to create allowlist: ' + error.message);
      setLoading(false);
      setTransactionInProgress(false);
      return false;
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

      // Simulate transaction
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedAllowlists = allowlists.map(list => {
            if (list.id === allowlistId) {
              return {
                ...list,
                members: [...list.members, memberAddress]
              };
            }
            return list;
          });
          
          setAllowlists(updatedAllowlists);
          setLastTransaction({
            type: 'addMember',
            id: "0x" + Math.random().toString(16).substring(2, 42),
            timestamp: Date.now()
          });
          
          setLoading(false);
          setTransactionInProgress(false);
          resolve(true);
        }, 2000);
      });
    } catch (error) {
      console.error('Error adding member:', error);
      setError('Failed to add member: ' + error.message);
      setLoading(false);
      setTransactionInProgress(false);
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
        setCurrentAllowlist,
      }}
    >
      {children}
    </SealContext.Provider>
  );
};

export const useSealContext = () => useContext(SealContext);

export default SealContext;
