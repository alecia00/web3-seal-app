import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import Header from './components/Header';
import AllowlistManager from './components/AllowlistManager';
import SubscriptionManager from './components/SubscriptionManager';
import HomePage from './pages/HomePage'; // Ubah jalur ini jika HomePage.js Anda berada di direktori pages/
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <WalletProvider>
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
      </WalletProvider>
    </Router>
  );
};

export default App;
