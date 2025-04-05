import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the wallet context
const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if wallet exists in the browser
  useEffect(() => {
    const checkWalletInstalled = () => {
      return window.suiWallet !== undefined || 
             window.sui !== undefined || 
             window.martian !== undefined;
    };

    if (address) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [address]);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo purposes, simulate wallet connection
      setTimeout(() => {
        // Simulating a successful wallet connection
        const mockAddress = "0x" + Math.random().toString(16).substring(2, 12);
        setAddress(mockAddress);
        setWallet({ type: 'demo' });
        setIsConnected(true);
        localStorage.setItem('connectedWallet', 'demo');
        localStorage.setItem('walletAddress', mockAddress);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
      setIsConnected(false);
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      setAddress('');
      setWallet(null);
      setIsConnected(false);
      localStorage.removeItem('connectedWallet');
      localStorage.removeItem('walletAddress');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      const connectedWallet = localStorage.getItem('connectedWallet');
      const storedAddress = localStorage.getItem('walletAddress');
      
      if (connectedWallet && storedAddress) {
        setAddress(storedAddress);
        setWallet({ type: connectedWallet });
        setIsConnected(true);
      }
    };

    autoConnect();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        address,
        isConnected,
        isLoading,
        error,
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
