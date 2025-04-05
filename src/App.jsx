import React, { useState } from 'react';
import Header from './components/Header';
import ConnectWallet from './components/ConnectWallet';
import ContentUpload from './components/ContentUpload';
import AllowlistManager from './components/AllowlistManager';
import SubscriptionManager from './components/SubscriptionManager';
import ContentViewer from './components/ContentViewer';
import { WalletProvider } from './contexts/WalletContext';
import { SealProvider } from './contexts/SealContext';
import './styles/globals.css';

function App() {
  // State for wallet modal
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  
  // State for current tab - 'allowlist' or 'subscription'
  const [currentTab, setCurrentTab] = useState('allowlist');
  
  // Function to open wallet modal
  const handleConnectWalletClick = () => {
    setIsWalletModalOpen(true);
  };
  
  // Function to close wallet modal
  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  return (
    <WalletProvider>
      <SealProvider>
        <div className="app-container">
          <Header onConnectWalletClick={handleConnectWalletClick} />
          
          <main className="main-content">
            <div className="info-box">
              <ol>
                <li>Code is available <a href="https://github.com/MystenLabs/seal/" target="_blank" rel="noopener noreferrer">here</a>.</li>
                <li>These examples are for Testnet only. Make sure you wallet is set to Testnet and has some balance (can request from <a href="https://faucet.sui.io" target="_blank" rel="noopener noreferrer">faucet.sui.io</a>).</li>
                <li>Blobs are only stored on Walrus Testnet for 1 epoch by default, older files cannot be retrieved even if you have access.</li>
                <li>Currently only image files are supported, and the UI is minimal, designed for demo purposes only!</li>
              </ol>
            </div>
            
            <div className="connect-prompt">
              <p>Please connect your wallet to continue</p>
              <button 
                className="connect-wallet-button"
                onClick={handleConnectWalletClick}
              >
                Connect Wallet
              </button>
            </div>
            
            {/* Tabs will be shown after wallet connection */}
            <div className="tabs-container" style={{ display: 'none' }}>
              <div className="tabs">
                <button 
                  className={`tab ${currentTab === 'allowlist' ? 'active' : ''}`}
                  onClick={() => setCurrentTab('allowlist')}
                >
                  Allowlist-Based Access
                </button>
                <button 
                  className={`tab ${currentTab === 'subscription' ? 'active' : ''}`}
                  onClick={() => setCurrentTab('subscription')}
                >
                  Subscription-Based Access
                </button>
              </div>
              
              <div className="tab-content">
                {currentTab === 'allowlist' && (
                  <div className="tab-pane">
                    <ContentUpload mode="allowlist" />
                    <AllowlistManager />
                    <ContentViewer mode="allowlist" />
                  </div>
                )}
                
                {currentTab === 'subscription' && (
                  <div className="tab-pane">
                    <ContentUpload mode="subscription" />
                    <SubscriptionManager />
                    <ContentViewer mode="subscription" />
                  </div>
                )}
              </div>
            </div>
          </main>
          
          {/* Wallet connection modal */}
          {isWalletModalOpen && (
            <ConnectWallet 
              onClose={closeWalletModal}
            />
          )}
          
          <footer className="footer">
            <p>
              This is a demonstration of Seal's capabilities and is intended solely as a playground environment.
              Do not connect your primary wallet or upload any sensitive content.
            </p>
          </footer>
        </div>
      </SealProvider>
    </WalletProvider>
  );
}

export default App;
