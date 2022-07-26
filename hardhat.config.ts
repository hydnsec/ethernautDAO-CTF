import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import 'dotenv/config'
import { parseUnits } from 'ethers/lib/utils'
import 'hardhat-deploy'
import 'hardhat-gas-reporter'
import { removeConsoleLog } from 'hardhat-preprocessor'
import 'hardhat-tracer'
import { HardhatUserConfig } from 'hardhat/types'

import './task/index'

// hardhat 0 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
const defaultPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

const config: HardhatUserConfig = {
  preprocess: {
    eachLine: removeConsoleLog((hre) => !['localhost', 'hardhat'].includes(hre.network.name)),
  },
  gasReporter: {
    currency: 'USD',
    enabled: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    gasPrice: 20, // in gwei
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: {
    compilers: [
      {
        version: '0.8.15',
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: '0x1fcd198c6f5F7F27AfAf39735F50C859b136Bb17',
    },
  },
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      gasPrice: parseUnits('10', 'gwei').toNumber(),
      accounts: [process.env.LOCAL_DEPLOYER_PRIVATE_KEY || defaultPrivateKey],
    },
    hardhat: {
      chainId: 5,
      gasPrice: parseUnits('10', 'gwei').toNumber(),
      forking: {
        url: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        blockNumber: 7247952, // car v2
        // blockNumber: 7242620, // car v1
      },
    },

    goerli: {
      chainId: 5,
      url: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      gasPrice: parseUnits('10', 'gwei').toNumber(),
      accounts: [process.env.GOERLI_DEPLOYER_PRIVATE_KEY || defaultPrivateKey],
    },
  },
}

export default config
