/**
 * Test script for Seal protocol smart contracts
 * 
 * This script runs tests for the Seal protocol smart contracts.
 * It uses the Sui Move testing framework.
 */

const { execSync } = require('child_process');
const path = require('path');

// Paths
const CONTRACTS_DIR = path.join(__dirname, '../contracts');
const ALLOWLIST_DIR = path.join(CONTRACTS_DIR, 'allowlist');
const SUBSCRIPTION_DIR = path.join(CONTRACTS_DIR, 'subscription');
const SHARED_DIR = path.join(CONTRACTS_DIR, 'shared');

console.log('Running tests for Seal protocol contracts...');

try {
  // Test shared utilities
  console.log('\nTesting shared utilities...');
  execSync(`cd ${SHARED_DIR} && sui move test`, { stdio: 'inherit' });
  
  // Test allowlist contract
  console.log('\nTesting allowlist contract...');
  execSync(`cd ${ALLOWLIST_DIR} && sui move test`, { stdio: 'inherit' });
  
  // Test subscription contract
  console.log('\nTesting subscription contract...');
  execSync(`cd ${SUBSCRIPTION_DIR} && sui move test`, { stdio: 'inherit' });
  
  console.log('\nAll tests passed successfully!');
} catch (error) {
  console.error('Tests failed:', error);
  process.exit(1);
}
