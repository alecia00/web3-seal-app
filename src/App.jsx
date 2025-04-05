import React, { useState } from 'react';
import { createNetworkConfig, SuiClientProvider, WalletProvider as SuiWalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from './contexts/WalletContext';
import ConnectWallet from './components/ConnectWallet';
import '@mysten/dapp-kit/dist/index.css';
import './wallet-modal.css';

// Create network configuration
const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
});

// Create query client
const queryClient = new QueryClient();

const App = () => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('mainnet');
  
  const toggleWalletModal = () => {
    setShowWalletModal(!showWalletModal);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork={selectedNetwork}>
        <SuiWalletProvider>
          <WalletProvider>
            <div className="app">
              <header className="header">
                <h1>Sui dApp Example</h1>
                <div className="header-actions">
                  <select 
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                    className="network-selector"
                  >
                    <option value="mainnet">Mainnet</option>
                    <option value="testnet">Testnet</option>
                  </select>
                  <button className="connect-button" onClick={toggleWalletModal}>
                    Connect Wallet
                  </button>
                </div>
              </header>
              
              <main className="main-content">
                <h2>Welcome to Your Sui dApp</h2>
                <p>Connect your wallet to get started.</p>
              </main>
              
              {showWalletModal && (
                <ConnectWallet onClose={() => setShowWalletModal(false)} />
              )}
            </div>
          </WalletProvider>
        </SuiWalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default App;
