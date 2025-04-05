import React, { createContext, useState, useEffect } from 'react';

// Membuat context
export const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState('testnet');
  
  // Simulasi koneksi wallet
  const connectWallet = async () => {
    try {
      // Ini hanya simulasi - dalam implementasi sebenarnya
      // akan memanggil fungsi koneksi wallet yang sesungguhnya

      // Simulasi alamat wallet
      const mockAddress = '0x' + Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('');
      
      setWalletAddress(mockAddress);
      setIsConnected(true);
      setBalance('1000');

      // Simpan ke localStorage agar tetap terkoneksi saat refresh
      localStorage.setItem('connectedWallet', mockAddress);
      
      console.log('Wallet connected:', mockAddress);
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setBalance('0');
    localStorage.removeItem('connectedWallet');
  };

  // Memeriksa apakah sudah terkoneksi saat aplikasi dimuat
  useEffect(() => {
    const savedWallet = localStorage.getItem('connectedWallet');
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setIsConnected(true);
      // Dalam implementasi nyata, kita perlu memverifikasi koneksi
      // dan mengupdate balance
      setBalance('1000');
    }
  }, []);

  // Fungsi utilitas untuk menandatangani message
  // Dalam aplikasi SUI sebenarnya, ini akan menggunakan 
  // fungsi dari paste-2.txt (signed_message.rs)
  const signMessage = async (message) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    
    console.log('Signing message:', message);
    // Simulasi signature
    return {
      signature: '0x' + Array.from({length: 128}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')
    };
  };

  // Berdasarkan fungsi di valid_ptb.rs (paste-3.txt)
  const validateTransaction = (transaction) => {
    try {
      // Simulasi validasi transaction berdasarkan logika
      // pada valid_ptb.rs
      console.log('Validating transaction:', transaction);
      return true;
    } catch (error) {
      console.error('Transaction validation failed:', error);
      return false;
    }
  };

  return (
    <WalletContext.Provider value={{
      isConnected,
      walletAddress,
      balance,
      network,
      connectWallet,
      disconnectWallet,
      signMessage,
      validateTransaction
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
