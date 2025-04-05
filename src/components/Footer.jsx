import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <p>Sui Seal Protocol - Running on Sui Testnet</p>
          </div>
          <div className="footer-links">
            <a href="https://docs.sui.io/" target="_blank" rel="noopener noreferrer">
              Sui Docs
            </a>
            <span className="footer-divider">|</span>
            <a href="https://faucet.sui.io/" target="_blank" rel="noopener noreferrer">
              Faucet
            </a>
            <span className="footer-divider">|</span>
            <a href="https://explorer.sui.io/" target="_blank" rel="noopener noreferrer">
              Explorer
            </a>
          </div>
          <div className="footer-credits">
            <p>
              Built by <span className="creator-link">techzs</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
