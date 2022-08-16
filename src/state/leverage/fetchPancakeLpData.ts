import lpTokenABI from 'config/abi/lpToken.json'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { LeverageFarmConfig } from 'config/constants/types'
import { LeverageFarm } from '../types'
import { fetchDatas } from '../helpers'

const pancakeLpFarmCalls = (farm: LeverageFarm) => {
  const { lpAddresses } = farm
  const lpAddress = getAddress(lpAddresses)
  return [
    {
      address: lpAddress,
      name: 'getReserves',
    },
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    // Balance of LP tokens in the master chef contract
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [getMasterChefAddress()],
    }
  ]
}

export const fetchPancakeLpDatas = async (farmsToFetch: LeverageFarmConfig[]): Promise<any[]> => {
  const pancakeLpCalls = farmsToFetch.map((farm) => pancakeLpFarmCalls(farm))
  
  return fetchDatas(lpTokenABI, pancakeLpCalls, farmsToFetch.length)
}