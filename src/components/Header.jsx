import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWalletContext } from '../contexts/WalletContext';
import ConnectWallet from './ConnectWallet';

const Header = () => {
  const location = useLocation();
  const { connected, address, connectWallet, disconnectWallet } = useWalletContext();
  const [showWalletModal, setShowWalletModal] = useState(false);
  
  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Handle wallet connect button click
  const handleConnectClick = () => {
    if (!connected) {
      setShowWalletModal(true);
    }
  };

  // Handle wallet disconnect
  const handleDisconnect = async () => {
    await disconnectWallet();
  };

  return (
    <header className="app-header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <h1>Sui Seal Protocol</h1>
            </Link>
          </div>
          
          <nav className="main-nav">
            <ul>
              <li className={location.pathname === "/" ? "active" : ""}>
                <Link to="/">Home</Link>
              </li>
              <li className={location.pathname === "/allowlist" ? "active" : ""}>
                <Link to="/allowlist">Allowlist</Link>
              </li>
              <li className={location.pathname === "/subscription" ? "active" : ""}>
                <Link to="/subscription">Subscription</Link>
              </li>
              <li>
                <a 
                  href="https://faucet.sui.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="faucet-link"
                >
                  Faucet
                </a>
              </li>
            </ul>
          </nav>
          
          <div className="wallet-section">
            {connected ? (
              <div className="wallet-info">
                <span className="wallet-address">{formatAddress(address)}</span>
                <button 
                  className="btn disconnect"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                className="btn connect"
                onClick={handleConnectClick}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
      
      {showWalletModal && (
        <ConnectWallet onClose={() => setShowWalletModal(false)} />
      )}
    </header>
  );
};

export default Header;
