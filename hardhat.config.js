const fs = require('fs');
require('@nomicfoundation/hardhat-toolbox');
require('hardhat-gas-reporter');
require('hardhat-deploy');

const private_key = fs.readFileSync('.secret').toString().trim();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    local: {
      url: 'http://127.0.0.1:854',
    },
    hardhat: {
      blockGasLimit: 70000000,
      allowUnlimitedContractSize: true, // need this for testing large contracts
    },
    devnet: {
      url: 'https://jsonrpc.dev.aura.network',
      chainId: 1235,
      gasPrice: 'auto',
      accounts: [private_key],
      gas: 20000000,
      timeout: 120000,
      throwOnTransactionFailures: true,
    },
    serenity: {
      url: 'https://jsonrpc.serenity.aura.network',
      chainId: 1236,
      gasPrice: 'auto',
      accounts: [private_key],
      gas: 20000000,
      timeout: 120000,
      throwOnTransactionFailures: true,
    },
    bsctestnet: {
      url: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
      chainId: 97,
      gasPrice: 'auto',
      accounts: [private_key],
      gas: 20000000,
      timeout: 120000,
      throwOnTransactionFailures: true,
    },
    xLayerTestnet: {
      url: 'https://xlayertestrpc.okx.com',
      chainId: 195,
      gasPrice: 'auto',
      accounts: [private_key],
      gas: 20000000,
      timeout: 120000,
      throwOnTransactionFailures: true,
    },
    sepolia: {
      url: 'https://rpc-sepolia.rockx.com',
      chainId: 11155111,
      gasPrice: 20000000000,
      accounts: [private_key],
      gas: 20000000,
      timeout: 120000,
      throwOnTransactionFailures: true,
    },
  },
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  paths: {
    deploy: 'scripts',
    deployments: 'deployments',
    imports: 'imports',
  },
};