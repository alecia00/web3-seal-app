// README.md
# Seal Example App

A React application that demonstrates the capabilities of the Seal Protocol on the Sui blockchain. This implementation showcases two main functionalities:

1. **Allowlist-Based Access**
2. **Subscription-Based Access**

## Overview

Seal is a decentralized access control protocol built on Sui that allows creators to share encrypted content with selected users.

## Features

- Connect to Sui-compatible wallets (Sui Wallet, Phantom, Martian, OKX)
- Create and manage allowlists for content access
- Set up subscription-based content access
- Upload and encrypt content
- Access and decrypt content based on permissions

## Getting Started

### Prerequisites

- Node.js 16+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/web3-seal-app.git
cd web3-seal-app

# Install dependencies
npm install
# or
pnpm install

# Start the development server
npm run dev
# or
pnpm dev
```

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Connect to Vercel and select your repository
3. Configure the build settings:
   - Build Command: `npm run build` or `pnpm build`
   - Output Directory: `build`
4. Deploy

## Important Notice

This application is a demonstration of Seal's capabilities and is intended solely as a playground environment. It does not provide guarantees of uptime, reliability, or correctness. Do not connect primary wallets or upload sensitive content.
