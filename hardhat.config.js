require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-waffle');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('hardhat-deploy');
require('dotenv').config();

module.exports = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  gasReporter: {
    currency: 'USD',
    // coinmarketcap: process.env.COINMARKETCAP,
    gasPriceApi: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice',
    gasPrice: 40,
  },
  networks: {
    hardhat: {},
    'somnia-testnet': {
       url: "https://enterprise.onerpc.com/somnia_testnet?apikey=Ku3gV1hlxVE3wPUH5aeLC126NpZfO2Sg",
       accounts: [process.env.PRIVATE_KEY],
       chainId: 50312,
       timeout: 60000,
    },
  },
  etherscan: {
    apiKey: {
       'somnia-testnet': 'empty', // As per documentation
    },
    customChains: [
       {
          network: "somnia-testnet",
          chainId: 50312,
          urls: {
             apiURL: "https://somnia.w3us.site/api",
             browserURL: "https://somnia.w3us.site"
          }
       },
    ]
  },
};
