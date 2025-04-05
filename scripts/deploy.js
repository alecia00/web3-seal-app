/**
 * Deploy script for Seal protocol smart contracts
 * 
 * This script deploys the Seal protocol smart contracts to the Sui network.
 * It can be used for both testnet and mainnet deployments.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const NETWORK = process.env.NETWORK || 'testnet';
const GAS_BUDGET = '100000000'; // 0.1 SUI

// Paths
const CONTRACTS_DIR = path.join(__dirname, '../contracts');
const ALLOWLIST_DIR = path.join(CONTRACTS_DIR, 'allowlist');
const SUBSCRIPTION_DIR = path.join(CONTRACTS_DIR, 'subscription');
const SHARED_DIR = path.join(CONTRACTS_DIR, 'shared');

// Deploy shared utilities first
console.log('Deploying shared utilities...');
try {
  // Build the package
  console.log('Building shared utilities...');
  execSync(`cd ${SHARED_DIR} && sui move build`, { stdio: 'inherit' });
  
  // Publish the package
  console.log('Publishing shared utilities...');
  const sharedOutput = execSync(
    `sui client publish --gas-budget ${GAS_BUDGET} --json`,
    { cwd: SHARED_DIR }
  ).toString();
  
  // Parse the package ID from the output
  const sharedResult = JSON.parse(sharedOutput);
  const sharedPackageId = sharedResult.packageId;
  
  console.log(`Shared utilities deployed with package ID: ${sharedPackageId}`);
  
  // Update the dependencies in allowlist and subscription Move.toml files
  updateDependencies(
    path.join(ALLOWLIST_DIR, 'Move.toml'),
    'seal_shared',
    sharedPackageId
  );
  
  updateDependencies(
    path.join(SUBSCRIPTION_DIR, 'Move.toml'),
    'seal_shared',
    sharedPackageId
  );
  
  // Deploy allowlist contract
  console.log('\nDeploying allowlist contract...');
  execSync(`cd ${ALLOWLIST_DIR} && sui move build`, { stdio: 'inherit' });
  
  const allowlistOutput = execSync(
    `sui client publish --gas-budget ${GAS_BUDGET} --json`,
    { cwd: ALLOWLIST_DIR }
  ).toString();
  
  const allowlistResult = JSON.parse(allowlistOutput);
  const allowlistPackageId = allowlistResult.packageId;
  
  console.log(`Allowlist contract deployed with package ID: ${allowlistPackageId}`);
  
  // Deploy subscription contract
  console.log('\nDeploying subscription contract...');
  execSync(`cd ${SUBSCRIPTION_DIR} && sui move build`, { stdio: 'inherit' });
  
  const subscriptionOutput = execSync(
    `sui client publish --gas-budget ${GAS_BUDGET} --json`,
    { cwd: SUBSCRIPTION_DIR }
  ).toString();
  
  const subscriptionResult = JSON.parse(subscriptionOutput);
  const subscriptionPackageId = subscriptionResult.packageId;
  
  console.log(`Subscription contract deployed with package ID: ${subscriptionPackageId}`);
  
  // Save deployment information
  const deploymentInfo = {
    network: NETWORK,
    timestamp: new Date().toISOString(),
    packages: {
      shared: sharedPackageId,
      allowlist: allowlistPackageId,
      subscription: subscriptionPackageId
    }
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../deployment.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log('\nDeployment completed successfully!');
  console.log(`Deployment information saved to deployment.json`);
  
  // Update .env file with package IDs for frontend
  console.log('\nUpdating environment variables for frontend...');
  const envContent = `
REACT_APP_NETWORK=${NETWORK}
REACT_APP_SHARED_PACKAGE=${sharedPackageId}
REACT_APP_ALLOWLIST_PACKAGE=${allowlistPackageId}
REACT_APP_SUBSCRIPTION_PACKAGE=${subscriptionPackageId}
  `.trim();
  
  fs.writeFileSync(path.join(__dirname, '../.env'), envContent);
  console.log('Environment variables updated in .env file');
  
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
}

/**
 * Update dependencies in Move.toml file
 * @param {string} filePath - Path to Move.toml file
 * @param {string} dependencyName - Name of the dependency
 * @param {string} packageId - Package ID to use
 */
function updateDependencies(filePath, dependencyName, packageId) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update the dependency
    const addressRegex = new RegExp(`seal = "0x0"`, 'g');
    content = content.replace(addressRegex, `seal = "${packageId}"`);
    
    // Add dependency if it doesn't exist
    if (!content.includes(dependencyName)) {
      const dependenciesSection = '[dependencies]\n';
      const newDependency = `${dependencyName} = { local = "../shared" }\n`;
      
      if (content.includes(dependenciesSection)) {
        content = content.replace(
          dependenciesSection,
          dependenciesSection + newDependency
        );
      } else {
        content += `\n${dependenciesSection}${newDependency}`;
      }
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated dependencies in ${filePath}`);
  } catch (error) {
    console.error(`Failed to update dependencies in ${filePath}:`, error);
    throw error;
  }
}
