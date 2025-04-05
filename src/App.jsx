import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Define simple components directly in App.jsx to avoid import issues
const HomePage = () => (
  <div className="home-page">
    <h1>Sui Seal Protocol</h1>
    <p>Decentralized Access Control on Sui Testnet</p>
    <div className="feature-cards">
      <div className="card">
        <h2>Allowlist System</h2>
        <p>Create allowlists to control access to your content</p>
      </div>
      <div className="card">
        <h2>Subscription Service</h2>
        <p>Monetize your content with NFT subscriptions</p>
      </div>
    </div>
  </div>
);

const Header = () => (
  <header className="app-header">
    <div className="container">
      <div className="header-content">
        <div className="logo">
          <h1>Sui Seal Protocol</h1>
        </div>
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="app-footer">
    <div className="container">
      <div className="footer-content">
        <p>Built on Sui Testnet</p>
        <p>Created by <a href="https://t.me/extrajossbos" target="_blank" rel="noopener noreferrer">techzs</a></p>
      </div>
    </div>
  </footer>
);

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
