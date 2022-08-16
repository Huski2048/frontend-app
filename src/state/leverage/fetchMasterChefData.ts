import masterChefABI from 'config/abi/masterchef.json'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { LeverageFarmConfig } from 'config/constants/types'
import { LeverageFarm } from '../types'
import { fetchDatas } from '../helpers'

const masterChefAddress = getMasterChefAddress()

const masterChefFarmCalls = (farm: LeverageFarm) => {
  const { workerAddress, pid } = farm

  return [
    {
      address: masterChefAddress,
      name: 'poolInfo',
      params: [pid],
    },
    {
      address: masterChefAddress,
      name: 'totalAllocPoint',
    },
    {
      address: masterChefAddress,
      name: 'userInfo',
      params: [pid, workerAddress],
    },
    // {
    //   address: masterChefAddress,
    //   name: 'userInfo',
    //   params: [pid, QuoteTokenInfo.address],
    // }
  ]
}

export const fetchMasterChefDatas = async (farmsToFetch: LeverageFarmConfig[]): Promise<any[]> => {
  const masterChefCalls = farmsToFetch.map((farm) => masterChefFarmCalls(farm))
  
  return fetchDatas(masterChefABI, masterChefCalls, farmsToFetch.length)
}