import React from 'react';
import { useWallet } from '../contexts/WalletContext';

const Header = ({ onConnectWalletClick }) => {
  const { walletAddress, currentWallet, isConnected, disconnectWallet } = useWallet();
  
  // Format wallet address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="header">
      <div className="header-logo">
        <h1>Seal Example Apps</h1>
      </div>
      
      <div className="header-actions">
        {isConnected && walletAddress ? (
          <div className="wallet-info">
            <span className="wallet-address">{formatAddress(walletAddress)}</span>
            <button className="wallet-disconnect" onClick={disconnectWallet}>
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            className="connect-wallet-btn"
            onClick={onConnectWalletClick}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
