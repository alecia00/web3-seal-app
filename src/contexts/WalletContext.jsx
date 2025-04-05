import React, { createContext, useState, useEffect, useContext } from 'react';
import { useWallet } from '@mysten/dapp-kit';

// Create wallet context
const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  // Use the Sui dApp Kit wallet hook
  const { 
    isConnected,
    currentAccount,
    connecting,
    disconnect,
    select,
    allAvailableWallets,
    connect
  } = useWallet();

  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update address when wallet connection changes
  useEffect(() => {
    if (isConnected && currentAccount) {
      setAddress(currentAccount.address);
    } else {
      setAddress('');
    }
  }, [isConnected, currentAccount]);

  // Wrapper for connecting to a wallet
  const connectWallet = async (walletType) => {
    try {
      setIsLoading(true);
      
      // Select wallet type if provided, otherwise show wallet selector
      if (walletType) {
        // Find the wallet in available wallets
        const selectedWallet = allAvailableWallets.find(
          wallet => wallet.name.toLowerCase() === walletType.toLowerCase()
        );
        
        if (selectedWallet) {
          await select(selectedWallet.name);
          await connect();
        } else {
          throw new Error(`Wallet type ${walletType} not found`);
        }
      } else {
        // If no wallet type specified, open the connector UI
        await connect();
      }
      
      return true;
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Wrapper for disconnecting wallet
  const disconnectWallet = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Get all available wallet options
  const getWalletOptions = () => {
    return allAvailableWallets.map(wallet => ({
      name: wallet.name,
      icon: wallet.icon,
      id: wallet.name.toLowerCase()
    }));
  };

  // Define wallet types constants
  const WALLET_TYPES = {
    SUI: 'sui wallet',
    PHANTOM: 'phantom',
    MARTIAN: 'martian sui wallet',
    OKX: 'okx wallet'
  };

  return (
    <WalletContext.Provider
      value={{
        connected: isConnected,
        address,
        isLoading: isLoading || connecting,
        connectWallet,
        disconnectWallet,
        getWalletOptions,
        WALLET_TYPES
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);

export default WalletContext;
