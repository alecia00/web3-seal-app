import React, { useState, useEffect } from 'react';
import { useWalletContext } from '../contexts/WalletContext';

const ConnectWallet = ({ onClose }) => {
  const { 
    connectWallet, 
    isLoading, 
    getWalletOptions,
    WALLET_TYPES
  } = useWalletContext();
  const [activeTab, setActiveTab] = useState('connect'); // 'connect' or 'info'
  const [error, setError] = useState('');
  const [walletOptions, setWalletOptions] = useState([]);
  
  useEffect(() => {
    // Get available wallet options when component mounts
    setWalletOptions(getWalletOptions());
  }, [getWalletOptions]);

  const handleWalletSelect = async (walletType) => {
    try {
      setError('');
      await connectWallet(walletType);
      // Close modal on successful connection
      onClose();
    } catch (err) {
      setError(`Failed to connect: ${err.message || 'Unknown error'}`);
      console.error('Wallet connection error:', err);
    }
  };

  // Dynamic wallet list instead of hardcoded options
  const renderWalletOptions = () => {
    if (!walletOptions.length) {
      return <div className="wallet-empty">No wallets detected. Please install a Sui wallet.</div>;
    }

    return walletOptions.map((wallet) => (
      <button
        key={wallet.id}
        className="wallet-option"
        onClick={() => handleWalletSelect(wallet.type)}
        disabled={isLoading}
      >
        <img 
          src={wallet.icon} 
          alt={`${wallet.name} logo`} 
          className="wallet-logo"
        />
        <span>{wallet.name}</span>
      </button>
    ));
  };

  return (
    <div className="wallet-modal-overlay" onClick={(e) => {
      // Close when clicking the overlay but not the modal itself
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="wallet-modal">
        <div className="wallet-modal-header">
          <div className="wallet-modal-tabs">
            <button
              className={`wallet-modal-tab ${activeTab === 'connect' ? 'active' : ''}`}
              onClick={() => setActiveTab('connect')}
            >
              Connect a Wallet
            </button>
            <button
              className={`wallet-modal-tab ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              What is a Wallet
            </button>
          </div>
          <button className="wallet-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="wallet-modal-content">
          {activeTab === 'connect' && (
            <div className="wallet-list">
              {renderWalletOptions()}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="wallet-info">
              <h3>Easy Login</h3>
              <p>
                No need to create new accounts and passwords for
                every website. Just connect your wallet and get
                going.
              </p>

              <h3>Store your Digital Assets</h3>
              <p>
                Send, receive, store, and display your digital assets
                like NFTs & coins.
              </p>
              
              <h3>Manage Your Web3 Identity</h3>
              <p>
                Your wallet serves as your identity in the decentralized web,
                allowing you to interact with dApps securely.
              </p>
              
              <div className="wallet-info-footer">
                <p>
                  Don't have a wallet yet? Visit the{' '}
                  <a 
                    href="https://docs.sui.io/guides/wallet" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Sui Documentation
                  </a>{' '}
                  to learn how to get started.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="wallet-error">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="wallet-connecting">
              <span className="wallet-connecting-spinner"></span>
              Connecting to wallet...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
