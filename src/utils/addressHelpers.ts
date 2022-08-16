import { ChainId } from '@pancakeswap/sdk'
import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address[chainId] ? address[chainId] : address[ChainId.MAINNET]
}

export const getFairLaunchAddress = () => {
  return getAddress(addresses.fairLaunch)
}
export const getHuskiAddress = () => {

  let address
  if (process.env.REACT_APP_CHAIN_ID === '97') {
    address = getAddress(tokens.huski.address)
  } else {
    address = getAddress(tokens.alpaca.address)
  }
  return address
}
export const getsHuskiAddress = () => {
  return getAddress(tokens.salpaca.address)
}
export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}
export const getWbnbAddress = () => {
  return getAddress(tokens.wbnb.address)
}
export const getPancakeProfileAddress = () => {
  return getAddress(addresses.pancakeProfile)
}

export const getCakeVaultAddress = () => {
  return getAddress(addresses.cakeVault)
}


