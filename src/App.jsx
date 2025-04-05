import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createNetworkConfig, SuiClientProvider, WalletProvider as SuiWalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import Header from './components/Header';
import AllowlistManager from './components/AllowlistManager';
import SubscriptionManager from './components/SubscriptionManager';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import { WalletProvider } from './contexts/WalletContext';
import { SealProvider } from './contexts/SealContext';

// Import Sui dApp Kit CSS
import '@mysten/dapp-kit/dist/index.css';

// Create network config for Sui
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

// Create query client for React Query
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <SuiWalletProvider autoConnect={false}>
          <Router>
            <WalletProvider>
              <SealProvider>
                <div className="app">
                  <Header />
                  <main className="main-content">
                    <div className="container">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/allowlist" element={<AllowlistManager />} />
                        <Route path="/subscription" element={<SubscriptionManager />} />
                      </Routes>
                    </div>
                  </main>
                  <Footer />
                </div>
              </SealProvider>
            </WalletProvider>
          </Router>
        </SuiWalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default App;
