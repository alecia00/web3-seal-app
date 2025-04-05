import React, { useState, useRef } from 'react';
import { useSeal } from '../contexts/SealContext';
import { useWallet } from '../contexts/WalletContext';

const ContentUpload = ({ mode }) => {
  const { isConnected } = useWallet();
  const { 
    uploadContent, 
    allowlists, 
    loading, 
    error 
  } = useSeal();
  
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAllowlistId, setSelectedAllowlistId] = useState('');
  const [price, setPrice] = useState(1000); // Default price in MIST
  const [duration, setDuration] = useState(60); // Default duration in minutes
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const fileInputRef = useRef(null);
  
  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  // Handle file drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadSuccess(false);
    setUploadError('');
    
    if (!file) {
      setUploadError('Please select a file to upload');
      return;
    }
    
    if (!name) {
      setUploadError('Please enter a name for the content');
      return;
    }
    
    try {
      let metadata = {
        name,
        description,
      };
      
      // Add mode-specific metadata
      if (mode === 'allowlist') {
        if (!selectedAllowlistId) {
          setUploadError('Please select an allowlist');
          return;
        }
        
        metadata.allowlistId = selectedAllowlistId;
      } else if (mode === 'subscription') {
        metadata.price = price;
        metadata.duration = duration;
      }
      
      // Upload content
      await uploadContent(file, metadata, mode);
      
      // Reset form
      setFile(null);
      setName('');
      setDescription('');
      setSelectedAllowlistId('');
      setUploadSuccess(true);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error uploading content:', err);
      setUploadError(err.message || 'Failed to upload content');
    }
  };
  
  // If not connected, show message
  if (!isConnected) {
    return (
      <div className="content-upload">
        <h2>Upload Content</h2>
        <p>Please connect your wallet to upload content.</p>
      </div>
    );
  }
  
  return (
    <div className="content-upload">
      <h2>Upload {mode === 'allowlist' ? 'Allowlist' : 'Subscription'} Content</h2>
      
      <form onSubmit={handleSubmit}>
        <div 
          className="file-drop-area"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {file ? (
            <div className="file-preview">
              <p>{file.name}</p>
              <p>{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          ) : (
            <div className="file-drop-message">
              <p>Drag & drop a file here, or click to select</p>
              <p className="file-drop-note">Supports image files only</p>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content-name">Name</label>
          <input
            type="text"
            id="content-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Content name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content-description">Description</label>
          <textarea
            id="content-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Content description"
            rows={3}
          />
        </div>
        
        {mode === 'allowlist' && (
          <div className="form-group">
            <label htmlFor="allowlist-select">Allowlist</label>
            <select
              id="allowlist-select"
              value={selectedAllowlistId}
              onChange={(e) => setSelectedAllowlistId(e.target.value)}
              required
            >
              <option value="">Select an allowlist</option>
              {allowlists.map((allowlist) => (
                <option key={allowlist.id} value={allowlist.id}>
                  {allowlist.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {mode === 'subscription' && (
          <>
            <div className="form-group">
              <label htmlFor="price-input">Price (MIST)</label>
              <input
                type="number"
                id="price-input"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                min={1}
                step={1}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="duration-input">Duration (minutes)</label>
              <input
                type="number"
                id="duration-input"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                min={1}
                step={1}
                required
              />
            </div>
          </>
        )}
        
        <button 
          type="submit" 
          className="upload-button"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Content'}
        </button>
        
        {uploadSuccess && (
          <div className="upload-success">
            Content uploaded successfully!
          </div>
        )}
        
        {(uploadError || error) && (
          <div className="upload-error">
            {uploadError || error}
          </div>
        )}
      </form>
    </div>
  );
};

export default ContentUpload;
