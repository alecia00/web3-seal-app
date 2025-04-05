import CryptoJS from 'crypto-js';

/**
 * Encrypts content using AES and splits the key into two shares
 * 
 * In a production environment, this would use a more sophisticated encryption
 * and key-sharing scheme like Shamir's Secret Sharing.
 * 
 * @param {ArrayBuffer|string} content - Content to encrypt
 * @returns {Object} Encrypted data and key shares
 */
export const encryptContent = async (content) => {
  try {
    // Generate random key
    const key = CryptoJS.lib.WordArray.random(32); // 256-bit key
    const keyString = key.toString();
    
    // Convert content to proper format
    let contentToEncrypt;
    if (content instanceof ArrayBuffer) {
      // Convert ArrayBuffer to WordArray
      contentToEncrypt = CryptoJS.lib.WordArray.create(new Uint8Array(content));
    } else if (typeof content === 'string') {
      contentToEncrypt = content;
    } else {
      throw new Error('Unsupported content type');
    }
    
    // Encrypt content
    const encryptedData = CryptoJS.AES.encrypt(contentToEncrypt, key.toString()).toString();
    
    // Create key shares (simple implementation - just split the key in half)
    // In a real implementation, use Shamir's Secret Sharing
    const share1 = keyString.substring(0, keyString.length / 2);
    const share2 = keyString.substring(keyString.length / 2);
    
    return {
      encryptedData,
      keyShares: [share1, share2]
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt content');
  }
};

/**
 * Decrypts content using key shares
 * 
 * @param {string} encryptedData - Encrypted data
 * @param {Array<string>} keyShares - Key shares to combine
 * @returns {ArrayBuffer|string} Decrypted content
 */
export const decryptContent = async (encryptedData, keyShares) => {
  try {
    // Combine key shares
    const key = combineKeyShares(keyShares);
    
    // Decrypt content
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, key);
    
    // Convert to string
    return decryptedData.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt content');
  }
};

/**
 * Combines key shares to reconstruct the original key
 * 
 * @param {Array<string>} keyShares - Key shares to combine
 * @returns {string} Reconstructed key
 */
export const combineKeyShares = (keyShares) => {
  // Simple implementation - just concatenate the shares
  // In a real implementation, use Shamir's Secret Sharing
  return keyShares.join('');
};

/**
 * Creates a binary file from decrypted content
 * 
 * @param {string} decryptedContent - Decrypted content
 * @param {string} mimeType - MIME type of the file
 * @returns {Blob} Binary file
 */
export const createFileFromDecryptedContent = (decryptedContent, mimeType) => {
  // Convert base64 string to binary
  const binaryString = window.atob(decryptedContent);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Create blob
  return new Blob([bytes], { type: mimeType });
};
