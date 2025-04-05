import React, { createContext, useState, useEffect, useContext } from 'react';

// Create wallet context
const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check local storage on mount
  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setAddress(storedAddress);
      setConnected(true);
    }
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    
    // Simulate connecting to wallet
    setTimeout(() => {
      const mockAddress = "0x" + Math.random().toString(16).substring(2, 12);
      setAddress(mockAddress);
      setConnected(true);
      localStorage.setItem('walletAddress', mockAddress);
      setIsLoading(false);
    }, 1000);
  };

  const disconnectWallet = () => {
    setAddress('');
    setConnected(false);
    localStorage.removeItem('walletAddress');
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        isLoading,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);

export default WalletContext;
