import React, { useState, useEffect } from 'react';
import { useSeal } from '../contexts/SealContext';
import { useWallet } from '../contexts/WalletContext';
import { createFileFromDecryptedContent } from '../services/encryptionService';

const ContentViewer = ({ mode }) => {
  const { isConnected, walletAddress } = useWallet();
  const { 
    encryptedContents, 
    accessContent, 
    loading, 
    error 
  } = useSeal();
  
  const [selectedContentId, setSelectedContentId] = useState('');
  const [decryptedContent, setDecryptedContent] = useState(null);
  const [decryptionError, setDecryptionError] = useState('');
  
  // Filter contents by mode
  const filteredContents = encryptedContents.filter(
    content => content.accessType === mode
  );
  
  // Handle decrypting content
  const handleDecryptContent = async () => {
    setDecryptedContent(null);
    setDecryptionError('');
    
    if (!selectedContentId) {
      setDecryptionError('Please select content to decrypt');
      return;
    }
    
    try {
      const content = filteredContents.find(c => c.id === selectedContentId);
      if (!content) {
        throw new Error('Content not found');
      }
      
      // Access and decrypt content
      const decrypted = await accessContent(selectedContentId);
      
      // Create a blob URL for the file
      const blob = createFileFromDecryptedContent(decrypted, content.type);
      const url = URL.createObjectURL(blob);
      
      setDecryptedContent({
        url,
        type: content.type,
        name: content.name
      });
    } catch (err) {
      console.error('Error decrypting content:', err);
      setDecryptionError(err.message || 'Failed to decrypt content');
    }
  };
  
  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (decryptedContent && decryptedContent.url) {
        URL.revokeObjectURL(decryptedContent.url);
      }
    };
  }, [decryptedContent]);
  
  // If not connected, show message
  if (!isConnected) {
    return (
      <div className="content-viewer">
        <h2>Content Viewer</h2>
        <p>Please connect your wallet to view content.</p>
      </div>
    );
  }
  
  return (
    <div className="content-viewer">
      <h2>Content Viewer ({mode === 'allowlist' ? 'Allowlist' : 'Subscription'})</h2>
      
      <div className="content-select">
        <div className="form-group">
          <label htmlFor="content-select">Select Content</label>
          <select
            id="content-select"
            value={selectedContentId}
            onChange={(e) => setSelectedContentId(e.target.value)}
          >
            <option value="">Select content to view</option>
            {filteredContents.map((content) => (
              <option key={content.id} value={content.id}>
                {content.name}
              </option>
            ))}
          </select>
        </div>
        
        <button
          type="button"
          className="decrypt-button"
          onClick={handleDecryptContent}
          disabled={loading || !selectedContentId}
        >
          {loading ? 'Decrypting...' : 'Decrypt and View'}
        </button>
      </div>
      
      {selectedContentId && filteredContents.find(c => c.id === selectedContentId) && (
        <div className="content-info">
          <h3>Content Details</h3>
          {(() => {
            const content = filteredContents.find(c => c.id === selectedContentId);
            if (!content) return null;
            
            return (
              <>
                <p>Name: {content.name}</p>
                <p>Type: {content.type}</p>
                <p>Size: {(content.size / 1024).toFixed(2)} KB</p>
                <p>Created: {new Date(content.createdAt).toLocaleString()}</p>
                <p>Creator: {content.creator === walletAddress ? 'You' : content.creator}</p>
              </>
            );
          })()}
        </div>
      )}
      
      {decryptedContent && (
        <div className="content-display">
          <h3>Decrypted Content</h3>
          
          {decryptedContent.type.startsWith('image/') ? (
            <div className="image-preview">
              <img src={decryptedContent.url} alt={decryptedContent.name} />
            </div>
          ) : (
            <div className="file-download">
              <p>Content is ready for download:</p>
              <a 
                href={decryptedContent.url} 
                download={decryptedContent.name}
                className="download-link"
              >
                Download {decryptedContent.name}
              </a>
            </div>
          )}
        </div>
      )}
      
      {(decryptionError || error) && (
        <div className="decryption-error">
          {decryptionError || error}
        </div>
      )}
      
      {filteredContents.length === 0 && (
        <div className="no-content">
          <p>No {mode} content available.</p>
          {mode === 'allowlist' ? (
            <p>Upload content with allowlist access or request access to existing content.</p>
          ) : (
            <p>Upload content with subscription access or purchase a subscription to existing content.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentViewer;
