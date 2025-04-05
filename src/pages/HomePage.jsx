import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWalletContext } from '../contexts/WalletContext';
import ConnectWallet from '../components/ConnectWallet';

const HomePage = () => {
  const { connected } = useWalletContext();
  const navigate = useNavigate();
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleGetStarted = () => {
    setShowWalletModal(true);
  };

  const handleFeatureClick = (path) => {
    if (connected) {
      navigate(path);
    } else {
      setShowWalletModal(true);
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Decentralized Access Control</h1>
          <p>
            Create, manage, and monetize content with blockchain-powered access control on Sui Testnet
          </p>
          <button className="btn primary large" onClick={handleGetStarted}>
            Get Started
          </button>
          <div className="testnet-notice">
            <p>This application runs on Sui Testnet only</p>
          </div>
        </div>
      </section>

      <section className="feature-cards">
        <div className="card feature-card" onClick={() => handleFeatureClick('/allowlist')}>
          <h2>Allowlist System</h2>
          <p>
            Create allowlists to control who can access your encrypted content based on wallet
            addresses. You maintain complete control over who can view your protected files.
          </p>
          <div className="feature-actions">
            <button className="btn primary">Manage Allowlists</button>
          </div>
        </div>

        <div className="card feature-card" onClick={() => handleFeatureClick('/subscription')}>
          <h2>Subscription Service</h2>
          <p>
            Define subscription-based access to your published content. Set subscription fees and
            duration, and monetize your content with NFT subscriptions on Sui.
          </p>
          <div className="feature-actions">
            <button className="btn secondary">Manage Subscriptions</button>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Connect Wallet</h3>
            <p>Connect your Sui wallet to get started with the platform.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Create Allowlist</h3>
            <p>Create and manage allowlists for your protected content.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Set Up Subscriptions</h3>
            <p>Define subscription parameters for monetization.</p>
          </div>
        </div>
      </section>

      {showWalletModal && (
        <ConnectWallet onClose={() => setShowWalletModal(false)} />
      )}
    </div>
  );
};

export default HomePage;
