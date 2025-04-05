import React from 'react';
import { Link } from 'react-router-dom';
import { useWalletContext } from '../contexts/WalletContext';

const Header = () => {
  const { isConnected, wallet, connectWallet, disconnectWallet } = useWalletContext();

  return (
    <header className="app-header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <h1>Seal Protocol</h1>
            </Link>
          </div>
          
          <nav className="main-nav">
            <ul>
              <li>
                <Link to="/allowlist">Allowlist</Link>
              </li>
              <li>
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
                  {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
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
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
