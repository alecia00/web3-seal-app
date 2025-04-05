import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <p>Built on Sui Testnet</p>
          </div>
          
          <div className="creator-info">
            <p>
              Created by <a 
                href="https://t.me/extrajossbos" 
                target="_blank" 
                rel="noopener noreferrer"
                className="creator-link"
              >
                techzs
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
