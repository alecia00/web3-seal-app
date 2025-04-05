import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './faucet.css';

const FaucetPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Sui faucet
    window.location.href = 'https://faucet.sui.io/';
    
    // Fallback navigation in case direct location change fails
    const timeoutId = setTimeout(() => {
      navigate('/');
    }, 2000);
    
    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <div className="faucet-redirect">
      <div className="card">
        <h2>Redirecting to Sui Faucet</h2>
        <p>You are being redirected to the Sui Testnet Faucet...</p>
        <div className="loader"></div>
        <p>If you are not redirected automatically, <a href="https://faucet.sui.io/" target="_blank" rel="noopener noreferrer">click here</a>.</p>
      </div>
    </div>
  );
};

export default FaucetPage;
