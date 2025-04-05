import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

const ConnectWallet = ({ onClose }) => {
  const { WALLET_TYPES, connectWallet, isConnecting, error } = useWallet();
  const [activeTab, setActiveTab] = useState('connect'); // 'connect' or 'info'

  const handleWalletSelect = async (walletType) => {
    try {
      await connectWallet(walletType);
      // Close modal on successful connection
      onClose();
    } catch (err) {
      // Error handling is done in the wallet context
      console.error('Wallet connection error:', err);
    }
  };

  return (
    <div className="wallet-modal-overlay">
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
          <button className="wallet-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="wallet-modal-content">
          {activeTab === 'connect' && (
            <div className="wallet-list">
              <button
                className="wallet-option"
                onClick={() => handleWalletSelect(WALLET_TYPES.SUI)}
                disabled={isConnecting}
              >
                <img 
                  src="/assets/sui-wallet-logo.svg" 
                  alt="Sui Wallet" 
                  className="wallet-logo"
                />
                <span>Sui Wallet</span>
              </button>

              <button
                className="wallet-option"
                onClick={() => handleWalletSelect(WALLET_TYPES.PHANTOM)}
                disabled={isConnecting}
              >
                <img 
                  src="/assets/phantom-logo.svg" 
                  alt="Phantom" 
                  className="wallet-logo"
                />
                <span>Phantom</span>
              </button>

              <button
                className="wallet-option"
                onClick={() => handleWalletSelect(WALLET_TYPES.MARTIAN)}
                disabled={isConnecting}
              >
                <img 
                  src="/assets/martian-logo.svg" 
                  alt="Martian Sui Wallet" 
                  className="wallet-logo"
                />
                <span>Martian Sui Wallet</span>
              </button>

              <button
                className="wallet-option"
                onClick={() => handleWalletSelect(WALLET_TYPES.OKX)}
                disabled={isConnecting}
              >
                <img 
                  src="/assets/okx-logo.svg" 
                  alt="OKX Wallet" 
                  className="wallet-logo"
                />
                <span>OKX Wallet</span>
              </button>
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

          {isConnecting && (
            <div className="wallet-connecting">
              Connecting to wallet...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet;
