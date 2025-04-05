import React, { createContext, useState, useEffect, useContext } from 'react';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';

// Create the wallet context
const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const wallet = useWallet();
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    if (wallet.connected && wallet.address) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [wallet.connected, wallet.address]);

  const connectWallet = async () => {
    try {
      await wallet.select('Sui Wallet');
      await wallet.connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      await wallet.disconnect();
      setIsConnected(false);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        address: wallet.address,
        isConnected,
        connectWallet,
        disconnectWallet,
        ConnectButton
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);

export default WalletContext;
