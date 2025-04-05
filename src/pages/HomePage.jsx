import React from 'react';
import { Link } from 'react-router-dom';
import { useWalletContext } from '../contexts/WalletContext';

const HomePage = () => {
  const { isConnected, connectWallet } = useWalletContext();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Decentralized Access Control</h1>
          <p>Create, manage, and monetize content with blockchain-powered access control</p>
          
          {!isConnected && (
            <button className="btn primary large" onClick={connectWallet}>
              Connect Wallet to Start
            </button>
          )}
        </div>
      </section>

      <section className="features">
        <div className="feature-cards">
          <div className="card feature-card">
            <h2>Allowlist Example</h2>
            <p>Define access based on wallet addresses. Create an allowlist, add or remove users in the list, and control who can access your encrypted content.</p>
            <Link to="/allowlist" className="btn secondary">
              Try Allowlist
            </Link>
          </div>

          <div className="card feature-card">
            <h2>Subscription Example</h2>
            <p>Define subscription-based access to your published content. Set subscription fees and duration, and monetize your content with NFT subscriptions.</p>
            <Link to="/subscription" className="btn secondary">
              Try Subscription
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
