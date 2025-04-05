import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const WalletContext = createContext(null);

// Hook for using wallet context
export const useWallet = () => useContext(WalletContext);

// Wallet types
export const WALLET_TYPES = {
  SUI: 'Sui Wallet',
  PHANTOM: 'Phantom',
  MARTIAN: 'Martian Sui Wallet',
  OKX: 'OKX Wallet'
};

export const WalletProvider = ({ children }) => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [currentWallet, setCurrentWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [network, setNetwork] = useState(null);

  // Check for existing connections on mount
  useEffect(() => {
    checkExistingConnection();
  }, []);

  // Function to check if a wallet is already connected
  const checkExistingConnection = async () => {
    try {
      // Check for Sui Wallet
      if (window.suiWallet) {
        const accounts = await window.suiWallet.getAccounts();
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setCurrentWallet(WALLET_TYPES.SUI);
          setIsConnected(true);
          return;
        }
      }

      // Check for Phantom
      if (window.phantom?.sui) {
        const accounts = await window.phantom.sui.getAccounts();
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setCurrentWallet(WALLET_TYPES.PHANTOM);
          setIsConnected(true);
          return;
        }
      }

      // Check for Martian
      if (window.martian?.sui) {
        const accounts = await window.martian.sui.getAccounts();
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setCurrentWallet(WALLET_TYPES.MARTIAN);
          setIsConnected(true);
          return;
        }
      }
      
      // Check for OKX
      if (window.okxwallet?.sui) {
        const accounts = await window.okxwallet.sui.getAccounts();
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setCurrentWallet(WALLET_TYPES.OKX);
          setIsConnected(true);
          return;
        }
      }
    } catch (err) {
      console.error('Error checking existing wallet connection:', err);
      setError('Failed to connect to existing wallet');
    }
  };
  
  // Connect to wallet
  const connectWallet = async (walletType) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      let accounts;
      
      switch (walletType) {
        case WALLET_TYPES.SUI:
          if (!window.suiWallet) {
            throw new Error('Sui Wallet extension not installed');
          }
          accounts = await window.suiWallet.requestPermissions();
          if (accounts && accounts.length > 0) {
            const address = await window.suiWallet.getAccounts();
            setWalletAddress(address[0]);
            setCurrentWallet(WALLET_TYPES.SUI);
            setIsConnected(true);
            
            // Get network
            const chain = await window.suiWallet.getChain();
            setNetwork(chain);
          }
          break;
          
        case WALLET_TYPES.PHANTOM:
          if (!window.phantom?.sui) {
            throw new Error('Phantom extension not installed');
          }
          accounts = await window.phantom.sui.connect();
          setWalletAddress(accounts.address);
          setCurrentWallet(WALLET_TYPES.PHANTOM);
          setIsConnected(true);
          
          // Get network
          const phantomChain = await window.phantom.sui.network();
          setNetwork(phantomChain);
          break;
          
        case WALLET_TYPES.MARTIAN:
          if (!window.martian?.sui) {
            throw new Error('Martian Sui Wallet extension not installed');
          }
          accounts = await window.martian.sui.connect();
          setWalletAddress(accounts.address);
          setCurrentWallet(WALLET_TYPES.MARTIAN);
          setIsConnected(true);
          
          // Get network
          const martianChain = await window.martian.sui.network();
          setNetwork(martianChain);
          break;
          
        case WALLET_TYPES.OKX:
          if (!window.okxwallet?.sui) {
            throw new Error('OKX Wallet extension not installed');
          }
          accounts = await window.okxwallet.sui.connect();
          setWalletAddress(accounts.address);
          setCurrentWallet(WALLET_TYPES.OKX);
          setIsConnected(true);
          
          // Get network
          const okxChain = await window.okxwallet.sui.network();
          setNetwork(okxChain);
          break;
          
        default:
          throw new Error('Unsupported wallet type');
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      // Handle disconnect based on wallet type
      if (currentWallet === WALLET_TYPES.SUI && window.suiWallet) {
        await window.suiWallet.disconnect();
      } else if (currentWallet === WALLET_TYPES.PHANTOM && window.phantom?.sui) {
        await window.phantom.sui.disconnect();
      } else if (currentWallet === WALLET_TYPES.MARTIAN && window.martian?.sui) {
        await window.martian.sui.disconnect();
      } else if (currentWallet === WALLET_TYPES.OKX && window.okxwallet?.sui) {
        await window.okxwallet.sui.disconnect();
      }
      
      // Reset state
      setWalletAddress(null);
      setCurrentWallet(null);
      setIsConnected(false);
      setNetwork(null);
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError('Failed to disconnect wallet');
    }
  };
  
  // Sign message
  const signMessage = async (message) => {
    try {
      if (!isConnected || !walletAddress) {
        throw new Error('No wallet connected');
      }
      
      let signature;
      const messageBytes = new TextEncoder().encode(message);
      
      switch (currentWallet) {
        case WALLET_TYPES.SUI:
          signature = await window.suiWallet.signMessage({
            message: messageBytes,
          });
          break;
          
        case WALLET_TYPES.PHANTOM:
          signature = await window.phantom.sui.signMessage({
            message: messageBytes,
          });
          break;
          
        case WALLET_TYPES.MARTIAN:
          signature = await window.martian.sui.signMessage({
            message: messageBytes,
          });
          break;
          
        case WALLET_TYPES.OKX:
          signature = await window.okxwallet.sui.signMessage({
            message: messageBytes,
          });
          break;
          
        default:
          throw new Error('Unsupported wallet type');
      }
      
      return signature;
    } catch (err) {
      console.error('Error signing message:', err);
      setError('Failed to sign message');
      throw err;
    }
  };
  
  // Execute transaction
  const executeTransaction = async (transaction) => {
    try {
      if (!isConnected || !walletAddress) {
        throw new Error('No wallet connected');
      }
      
      let result;
      
      switch (currentWallet) {
        case WALLET_TYPES.SUI:
          result = await window.suiWallet.signAndExecuteTransaction({
            transaction,
          });
          break;
          
        case WALLET_TYPES.PHANTOM:
          result = await window.phantom.sui.signAndExecuteTransaction({
            transaction,
          });
          break;
          
        case WALLET_TYPES.MARTIAN:
          result = await window.martian.sui.signAndExecuteTransaction({
            transaction,
          });
          break;
          
        case WALLET_TYPES.OKX:
          result = await window.okxwallet.sui.signAndExecuteTransaction({
            transaction,
          });
          break;
          
        default:
          throw new Error('Unsupported wallet type');
      }
      
      return result;
    } catch (err) {
      console.error('Error executing transaction:', err);
      setError('Failed to execute transaction');
      throw err;
    }
  };
  
  // Value to be provided by the context
  const value = {
    WALLET_TYPES,
    walletAddress,
    currentWallet,
    isConnecting,
    isConnected,
    error,
    network,
    connectWallet,
    disconnectWallet,
    signMessage,
    executeTransaction,
  };
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
