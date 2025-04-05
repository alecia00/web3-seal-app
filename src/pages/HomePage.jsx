import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext.jsx';
import '../styles/home.css';

const HomePage = () => {
  const { isConnected, connectWallet } = useWallet();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Seal App</h1>
        <p className="subtitle">Secure content access control on the SUI blockchain</p>
        
        <div className="cta-buttons">
          {!isConnected ? (
            <button className="primary-button" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <Link to="/upload" className="primary-button">
              Upload Content
            </Link>
          )}
          
          <Link to="/browse" className="secondary-button">
            Browse Content
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2>How It Works</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon secure"></div>
            <h3>Secure Encryption</h3>
            <p>Content is encrypted using Seal protocol to ensure only authorized users can access it.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon decentralized"></div>
            <h3>Decentralized Access</h3>
            <p>Access controls are enforced by smart contracts on the SUI blockchain.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon monetize"></div>
            <h3>Monetize Content</h3>
            <p>Create subscription models or one-time access for your premium content.</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="info-card">
          <h2>Need Testnet SUI?</h2>
          <p>Get testnet tokens to experiment with the platform.</p>
          <Link to="/faucet" className="info-button">
            Visit Faucet
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
