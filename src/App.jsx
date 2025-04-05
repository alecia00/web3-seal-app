import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { SealProvider } from './contexts/SealContext';
import Header from './components/Header';
import AllowlistManager from './components/AllowlistManager';
import SubscriptionManager from './components/SubscriptionManager';
import HomePage from './components/HomePage';
import FaucetPage from './components/FaucetPage';
import Footer from './components/Footer';
import './styles/globals.css';

const App = () => {
  return (
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
                  <Route path="/faucet" element={<FaucetPage />} />
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        </SealProvider>
      </WalletProvider>
    </Router>
  );
};

export default App;
