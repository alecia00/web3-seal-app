import React, { useState, useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { Link, useLocation } from 'react-router-dom';
import '../styles/components.css';

// Ikon dapat diganti dengan gambar kustom
// Ukuran rekomendasi: 24x24px untuk ikon kecil, 32x32px untuk ikon utama
const Header = () => {
  const { isConnected, connectWallet, disconnectWallet, walletAddress } = useContext(WalletContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  // Fungsi untuk mempersingkat alamat wallet
  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img src="/logo.svg" alt="Seal App" className="logo-image" />
            <span className="logo-text">Seal App</span>
          </Link>
        </div>
        
        <nav className="main-nav">
          <ul className="nav-list">
            <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              <Link to="/">Home</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/upload' ? 'active' : ''}`}>
              <Link to="/upload">Upload Content</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/browse' ? 'active' : ''}`}>
              <Link to="/browse">Browse</Link>
            </li>
            <li className={`nav-item ${location.pathname === '/faucet' ? 'active' : ''}`}>
              <Link to="/faucet">Faucet</Link>
            </li>
          </ul>
        </nav>
        
        <div className="wallet-container">
          {!isConnected ? (
            <button 
              className="connect-wallet-button" 
              onClick={connectWallet}
            >
              <img src="/wallet-icon.svg" alt="" className="wallet-icon" />
              Connect Wallet
            </button>
          ) : (
            <div className="wallet-info">
              <div 
                className="wallet-address" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="wallet-indicator"></div>
                <span>{shortenAddress(walletAddress)}</span>
                <span className="dropdown-arrow">▼</span>
              </div>
              
              {isDropdownOpen && (
                <div className="wallet-dropdown">
                  <div className="dropdown-item address">
                    <span className="label">Address:</span>
                    <span className="value">{walletAddress}</span>
                    <button 
                      className="copy-button"
                      onClick={() => {
                        navigator.clipboard.writeText(walletAddress);
                        // Show copy tooltip
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <div className="dropdown-item">
                    <Link to="/profile">My Profile</Link>
                  </div>
                  <div className="dropdown-item">
                    <Link to="/subscriptions">My Subscriptions</Link>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="disconnect-button dropdown-item"
                    onClick={disconnectWallet}
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
