import React from 'react';
import { Link } from 'react-router-dom';
import { useWalletContext } from '../contexts/WalletContext';

const HomePage = () => {
  const { connected, connectWallet, isLoading } = useWalletContext();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Decentralized Access Control</h1>
          <p>Create, manage, and monetize content with blockchain-powered access control on Sui Testnet</p>
          
          {!connected && (
            <button 
              className="btn primary large" 
              onClick={connectWallet}
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Connect Wallet to Start'}
            </button>
          )}
        </div>
      </section>

      <section className="features">
        <div className="feature-cards">
          <Link to="/allowlist" className="card feature-card">
            <h2>Allowlist System</h2>
            <p>Create allowlists to control access to your content based on wallet addresses. You maintain complete control over who can view your protected files.</p>
            <div className="feature-actions">
              <span className="btn secondary">Manage Allowlists</span>
            </div>
          </Link>

          <Link to="/subscription" className="card feature-card">
            <h2>Subscription Service</h2>
            <p>Define subscription-based access to your published content. Set subscription fees and duration, and monetize your content with NFT subscriptions on Sui.</p>
            <div className="feature-actions">
              <span className="btn secondary">Manage Subscriptions</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
