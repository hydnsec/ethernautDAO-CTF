import { BigNumber } from 'ethers'
import { task } from 'hardhat/config'

task('ethernautCarV2', 'ethernautCarV2').setAction(async (taskArguments, hre) => {
  const { deployer } = await hre.getNamedAccounts()
  const signer = await hre.ethers.getSigner(deployer)
  const HmifcDeployment = await hre.deployments.get('EthernautCarExploitV2')
  const hmifc = await hre.ethers.getContractAt('EthernautCarExploitV2', HmifcDeployment.address, signer)
  const tx1 = await hmifc.execute({
    gasPrice: BigNumber.from(hre.config.networks[hre.network.name].gasPrice),
  })
  console.info(`Tx ${tx1.hash} waiting`)
  const receipt = await tx1.wait()
  console.info(`Tx ${tx1.hash} done gasUsed ${receipt.gasUsed.toString()}`)
})
