import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWalletContext } from '../contexts/WalletContext';

const Header = () => {
  const { isConnected, address, isLoading, connectWallet, disconnectWallet } = useWalletContext();
  const location = useLocation();

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
              <li className={location.pathname === '/allowlist' ? 'active' : ''}>
                <Link to="/allowlist">Allowlist</Link>
              </li>
              <li className={location.pathname === '/subscription' ? 'active' : ''}>
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
            {isConnected ? (
              <div className="wallet-info">
                <span className="wallet-address">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button 
                  className="btn disconnect"
                  onClick={disconnectWallet}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                className="btn connect"
                onClick={connectWallet}
                disabled={isLoading}
              >
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
