import React from 'react';
import { Link } from 'react-router-dom';
import { useWalletContext } from '../contexts/WalletContext';

const HomePage = () => {
  const { isConnected, connectWallet, isLoading } = useWalletContext();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Decentralized Access Control</h1>
          <p>Create, manage, and monetize content with blockchain-powered access control on Sui Testnet</p>
          
          {!isConnected && (
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
          <div className="card feature-card">
            <h2>Allowlist System</h2>
            <p>Create allowlists to control who can access your encrypted content based on wallet addresses. You maintain complete control over who can view your protected files.</p>
            <div className="feature-actions">
              <Link to="/allowlist" className="btn secondary">
                Manage Allowlists
              </Link>
            </div>
          </div>

          <div className="card feature-card">
            <h2>Subscription Service</h2>
            <p>Define subscription-based access to your published content. Set subscription fees and duration, and monetize your content with NFT subscriptions on Sui.</p>
            <div className="feature-actions">
              <Link to="/subscription" className="btn secondary">
                Manage Subscriptions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Connect Your Wallet</h3>
            <p>Connect your Sui wallet to interact with the Seal Protocol on testnet</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Create Access Rules</h3>
            <p>Set up allowlists or subscription parameters for your content</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Manage Access</h3>
            <p>Add or remove addresses from your allowlists with on-chain transactions</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Encrypt Content</h3>
            <p>Your content is automatically encrypted and only accessible by authorized users</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
