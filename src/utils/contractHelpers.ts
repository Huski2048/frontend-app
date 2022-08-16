import { ethers } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'

// Addresses
import {
  getPancakeProfileAddress,
  getFairLaunchAddress,
  getMasterChefAddress,
  getCakeVaultAddress,
  getMulticallAddress,
} from 'utils/addressHelpers'

// ABI
import profileABI from 'config/abi/pancakeProfile.json'
import bep20Abi from 'config/abi/erc20.json'
import fairLaunchAbi from 'config/abi/fairLaunch.json'
import vaultAbi from 'config/abi/vault.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import masterChef from 'config/abi/masterchef.json'
import cakeVaultAbi from 'config/abi/cakeVault.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import workerConfigAbi from 'config/abi/WorkerConfig.json'


const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new ethers.Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bep20Abi, address, signer)
}
export const getVaultContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(vaultAbi, address, signer)
}
export const getWorkerConfigContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(workerConfigAbi, address, signer)
}

export const getErc721Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(erc721Abi, address, signer)
}
export const getLpContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(lpTokenAbi, address, signer)
}

export const getClaimFairLaunchContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(fairLaunchAbi, getFairLaunchAddress(), signer)
}
export const getProfileContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(profileABI, getPancakeProfileAddress(), signer)
}
export const getMasterchefContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(masterChef, getMasterChefAddress(), signer)
}

export const getCakeVaultContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(cakeVaultAbi, getCakeVaultAddress(), signer)
}

export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress(), signer)
}
