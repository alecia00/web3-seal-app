import React, { createContext, useContext, useState } from 'react';
import { useWalletContext } from './WalletContext';

const SealContext = createContext(null);

export const SealProvider = ({ children }) => {
  const { wallet, address } = useWalletContext();
  const [allowlists, setAllowlists] = useState([]);
  const [currentAllowlist, setCurrentAllowlist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createAllowlist = async (name) => {
    if (!wallet.connected) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Connect to the Sui wallet extension and request to create an allowlist
      // This is where we'll interact with the Sui blockchain
      const response = await fetch("https://fullnode.testnet.sui.io/", {
        headers: {
          "accept": "*/*",
          "content-type": "application/json",
          "client-request-method": "sui_executeTransactionBlock",
          "client-sdk-type": "typescript",
          "client-sdk-version": "1.26.1",
          "client-target-api-version": "1.47.0",
        },
        referrer: window.location.origin,
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "method": "sui_executeTransactionBlock",
          "params": [
            // This would be the actual transaction data
            // For now, we're using a placeholder
            `AAABAAgH${name}AEAATLCBRX...`, 
            [],
            {"showRawEffects": true, "showEffects": true}
          ]
        }),
        method: "POST",
        mode: "cors",
        credentials: "omit"
      });

      // Simulate wallet interaction
      // In a real app, you would use the wallet SDK to sign and send the transaction

      // Mock successful creation
      setAllowlists([...allowlists, {
        id: Date.now().toString(),
        name,
        owner: address,
        members: []
      }]);

      return true;
    } catch (error) {
      console.error('Error creating allowlist:', error);
      setError('Failed to create allowlist. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getAllAllowlists = async () => {
    if (!wallet.connected) {
      setError('Please connect your wallet first');
      return [];
    }

    try {
      setLoading(true);
      setError(null);

      // In a real app, you would fetch this from the blockchain
      // For now, we'll just return what we have in state
      return allowlists;
    } catch (error) {
      console.error('Error fetching allowlists:', error);
      setError('Failed to fetch allowlists. Please try again.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <SealContext.Provider
      value={{
        allowlists,
        currentAllowlist,
        loading,
        error,
        createAllowlist,
        getAllAllowlists,
        setCurrentAllowlist,
      }}
    >
      {children}
    </SealContext.Provider>
  );
};

export const useSealContext = () => useContext(SealContext);

export default SealContext;
