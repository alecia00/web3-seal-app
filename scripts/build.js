/**
 * Build script for Seal protocol
 * 
 * This script builds both the React frontend and the Sui Move smart contracts.
 * On Vercel, it will skip the smart contract build step.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Paths
const ROOT_DIR = path.join(__dirname, '..');
const CONTRACTS_DIR = path.join(ROOT_DIR, 'contracts');
const ALLOWLIST_DIR = path.join(CONTRACTS_DIR, 'allowlist');
const SUBSCRIPTION_DIR = path.join(CONTRACTS_DIR, 'subscription');
const SHARED_DIR = path.join(CONTRACTS_DIR, 'shared');

// Check if running on Vercel
const isVercel = process.env.VERCEL === '1';

console.log('Building Seal protocol...');

try {
  // Only build smart contracts if not on Vercel
  if (!isVercel) {
    console.log('\nBuilding smart contracts...');
    
    console.log('Building shared utilities...');
    execSync(`cd ${SHARED_DIR} && sui move build`, { stdio: 'inherit' });
    
    console.log('Building allowlist contract...');
    execSync(`cd ${ALLOWLIST_DIR} && sui move build`, { stdio: 'inherit' });
    
    console.log('Building subscription contract...');
    execSync(`cd ${SUBSCRIPTION_DIR} && sui move build`, { stdio: 'inherit' });
  } else {
    console.log('\nSkipping smart contract build on Vercel environment...');
  }
  
  // Build React frontend
  console.log('\nBuilding React frontend...');
  execSync('react-scripts build', { stdio: 'inherit', cwd: ROOT_DIR });
  
  console.log('\nBuild completed successfully!');
  
  // Only copy ABIs if they exist and we're not on Vercel
  if (!isVercel) {
    console.log('\nCopying contract ABIs to build directory...');
    
    const BUILD_DIR = path.join(ROOT_DIR, 'build');
    const CONTRACTS_BUILD_DIR = path.join(BUILD_DIR, 'contracts');
    
    // Create contracts directory in build if it doesn't exist
    if (!fs.existsSync(CONTRACTS_BUILD_DIR)) {
      fs.mkdirSync(CONTRACTS_BUILD_DIR, { recursive: true });
    }
    
    // Copy shared utilities ABI
    const SHARED_BUILD_DIR = path.join(SHARED_DIR, 'build');
    if (fs.existsSync(SHARED_BUILD_DIR)) {
      const files = fs.readdirSync(SHARED_BUILD_DIR);
      for (const file of files) {
        if (file.endsWith('.json')) {
          fs.copyFileSync(
            path.join(SHARED_BUILD_DIR, file),
            path.join(CONTRACTS_BUILD_DIR, `shared_${file}`)
          );
        }
      }
    }
    
    // Copy allowlist contract ABI
    const ALLOWLIST_BUILD_DIR = path.join(ALLOWLIST_DIR, 'build');
    if (fs.existsSync(ALLOWLIST_BUILD_DIR)) {
      const files = fs.readdirSync(ALLOWLIST_BUILD_DIR);
      for (const file of files) {
        if (file.endsWith('.json')) {
          fs.copyFileSync(
            path.join(ALLOWLIST_BUILD_DIR, file),
            path.join(CONTRACTS_BUILD_DIR, `allowlist_${file}`)
          );
        }
      }
    }
    
    // Copy subscription contract ABI
    const SUBSCRIPTION_BUILD_DIR = path.join(SUBSCRIPTION_DIR, 'build');
    if (fs.existsSync(SUBSCRIPTION_BUILD_DIR)) {
      const files = fs.readdirSync(SUBSCRIPTION_BUILD_DIR);
      for (const file of files) {
        if (file.endsWith('.json')) {
          fs.copyFileSync(
            path.join(SUBSCRIPTION_BUILD_DIR, file),
            path.join(CONTRACTS_BUILD_DIR, `subscription_${file}`)
          );
        }
      }
    }
    
    console.log('Contract ABIs copied successfully!');
  } else {
    console.log('\nSkipping contract ABI copying on Vercel environment...');
  }
  
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
