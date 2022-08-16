import erc20 from 'config/abi/erc20.json'
import { getAddress } from 'utils/addressHelpers'
import { LeverageFarmConfig } from 'config/constants/types'
import { LeverageFarm } from '../types'
import { fetchDatas } from '../helpers'

const tokenFarmCalls = (farm: LeverageFarm) => {
  const { lpAddresses, token, quoteToken } = farm
  const lpAddress = getAddress(lpAddresses)
  const tokenAddress = getAddress(token.address)
  const quoteTokenAddress = getAddress(quoteToken.address)

  return [
    {
      address: tokenAddress,
      name: 'balanceOf',
      params: [lpAddress],
    },
    {
      address: quoteTokenAddress,
      name: 'balanceOf',
      params: [lpAddress],
    },
    {
      address: tokenAddress,
      name: 'decimals',
    },
    {
      address: quoteTokenAddress,
      name: 'decimals',
    }
  ]
}

export const fetchTokenDatas = async (farmsToFetch: LeverageFarmConfig[]): Promise<any[]> => {
  const tokenCalls = farmsToFetch.map((farm) => tokenFarmCalls(farm))
  
  return fetchDatas(erc20, tokenCalls, farmsToFetch.length)
}


const tokenUserCalls = (account: string, farm: LeverageFarm) => {
  const { pool, token, quoteToken } = farm
  const vaultAddress = getAddress(pool.address)
  const tokenAddress = getAddress(token.address)
  const quoteTokenAddress = getAddress(quoteToken.address)
  return [
    {
      address: tokenAddress,
      name: 'balanceOf',
      params: [account],
    },
    {
      address: quoteTokenAddress,
      name: 'balanceOf',
      params: [account],
    },
    {
      address: tokenAddress, 
      name: 'allowance', 
      params: [account, vaultAddress] 
    },
    {
      address: quoteTokenAddress, 
      name: 'allowance', 
      params: [account, vaultAddress] 
    }
  ]
}

export const fetchTokenUserDatas = async (account: string, farmsToFetch: LeverageFarmConfig[]): Promise<any[]> => {
  const tokenCalls = farmsToFetch.map((farm) => tokenUserCalls(account, farm))

  return fetchDatas(erc20, tokenCalls, farmsToFetch.length)
}
