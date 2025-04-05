import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useWallets, useCurrentWallet, useConnectWallet, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';

// Define wallet types
const WALLET_TYPES = {
  SUI: 'sui',
  PHANTOM: 'phantom',
  MARTIAN: 'martian',
  OKX: 'okx'
};

// Create context
const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const wallets = useWallets();
  const { currentWallet, connectionStatus } = useCurrentWallet();
  const { mutate: connectWalletMutation } = useConnectWallet();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const currentAccount = useCurrentAccount();

  // Get all available wallet options
  const getWalletOptions = useCallback(() => {
    return wallets.map(wallet => ({
      id: wallet.name.toLowerCase().replace(/\s+/g, '-'),
      name: wallet.name,
      icon: wallet.icon,
      type: wallet.name.toLowerCase().includes('sui') ? WALLET_TYPES.SUI :
            wallet.name.toLowerCase().includes('phantom') ? WALLET_TYPES.PHANTOM :
            wallet.name.toLowerCase().includes('martian') ? WALLET_TYPES.MARTIAN :
            wallet.name.toLowerCase().includes('okx') ? WALLET_TYPES.OKX : null
    }));
  }, [wallets]);

  // Connect to wallet
  const connectWallet = useCallback(async (walletType) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const selectedWallet = wallets.find(wallet => {
        const walletName = wallet.name.toLowerCase();
        switch(walletType) {
          case WALLET_TYPES.SUI:
            return walletName.includes('sui') && !walletName.includes('martian');
          case WALLET_TYPES.PHANTOM:
            return walletName.includes('phantom');
          case WALLET_TYPES.MARTIAN:
            return walletName.includes('martian');
          case WALLET_TYPES.OKX:
            return walletName.includes('okx');
          default:
            return false;
        }
      });

      if (!selectedWallet) {
        throw new Error(`${walletType} wallet not found. Please install it first.`);
      }

      // Connect to the selected wallet
      return new Promise((resolve, reject) => {
        connectWalletMutation(
          { wallet: selectedWallet },
          {
            onSuccess: () => {
              setIsLoading(false);
              resolve();
            },
            onError: (err) => {
              setError(err.message || 'Failed to connect');
              setIsLoading(false);
              reject(err);
            }
          }
        );
      });
    } catch (err) {
      setError(err.message || 'Failed to connect');
      setIsLoading(false);
      throw err;
    }
  }, [wallets, connectWalletMutation]);

  // Disconnect wallet
  const disconnectWalletHandler = useCallback(() => {
    setIsLoading(true);
    disconnectWallet(
      {},
      {
        onSuccess: () => {
          setIsLoading(false);
        },
        onError: (err) => {
          setError(err.message || 'Failed to disconnect');
          setIsLoading(false);
        }
      }
    );
  }, [disconnectWallet]);

  // Check if connected
  const isConnected = connectionStatus === 'connected' && currentAccount;

  const walletContextValue = {
    WALLET_TYPES,
    connectWallet,
    disconnectWallet: disconnectWalletHandler,
    getWalletOptions,
    isLoading,
    error,
    isConnected,
    currentWallet,
    currentAccount
  };

  return (
    <WalletContext.Provider value={walletContextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};
