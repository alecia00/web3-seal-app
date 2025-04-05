import React, { createContext, useState, useEffect, useContext } from 'react';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { WebCryptoSigner } from '@mysten/signers/webcrypto';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';
import { SuiClient } from '@mysten/sui/client';

// Create the wallet context
const WalletContext = createContext(null);

// Initialize SuiClient for testnet
const suiClient = new SuiClient({
  url: 'https://fullnode.testnet.sui.io',
});

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if wallet exists in the browser
  useEffect(() => {
    const checkWalletInstalled = () => {
      return window.suiWallet !== undefined || window.eternl !== undefined || window.arconnect !== undefined;
    };

    setIsConnected(!!address && checkWalletInstalled());
  }, [address]);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if wallet extension exists
      if (!window.suiWallet) {
        throw new Error('Sui Wallet extension is not installed');
      }

      // Request connection to the wallet
      const response = await window.suiWallet.requestPermissions();
      
      if (response.status === 'success') {
        const walletAccount = await window.suiWallet.getAccounts();
        if (walletAccount && walletAccount.length > 0) {
          setAddress(walletAccount[0]);
          setWallet(window.suiWallet);
          setIsConnected(true);
          localStorage.setItem('connectedWallet', 'suiWallet');
        } else {
          throw new Error('No accounts found in wallet');
        }
      } else {
        throw new Error('Failed to connect wallet');
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      setAddress('');
      setWallet(null);
      setIsConnected(false);
      localStorage.removeItem('connectedWallet');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      const connectedWallet = localStorage.getItem('connectedWallet');
      if (connectedWallet === 'suiWallet' && window.suiWallet) {
        connectWallet();
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
        disconnectWallet,
        suiClient
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);

export default WalletContext;
