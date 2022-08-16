import fairLaunchABI from 'config/abi/fairLaunch.json'
import { getFairLaunchAddress } from 'utils/addressHelpers'
import { PoolsConfig } from 'config/constants/types'
import { Pool } from '../types'
import { fetchDatas } from '../helpers'

const fairLaunchAddress = getFairLaunchAddress()

const fairLaunchFarmCalls = (poolToFetch: Pool) => {
  const { pool } = poolToFetch

  return [
    {
      address: fairLaunchAddress,
      name: 'poolInfo',
      params: [pool.pid],
    },
    {
      address: fairLaunchAddress,
      name: 'poolInfo',
      params: [pool.debtPid],
    },
    // {
    //   address: fairLaunchAddress,
    //   name: 'poolInfo',
    //   params: [TokenInfo.quoteToken?.debtPoolId],
    // },
    {
      address: fairLaunchAddress,
      name: 'huskyPerBlock',
    },
    {
      address: fairLaunchAddress,
      name: 'totalAllocPoint',
    }
  ]
}

export const fetchFairLaunchDatas = async (poolsToFetch: PoolsConfig[]): Promise<any[]> => {
  const fairLaunchCalls = poolsToFetch.map((poolToFetch) => fairLaunchFarmCalls(poolToFetch))

  return fetchDatas(fairLaunchABI, fairLaunchCalls, poolsToFetch.length)
}

const fairLaunchUserCalls = (account: string, poolToFetch: Pool) => {
  const { pool } = poolToFetch
  return [
    {
      address: fairLaunchAddress,
      name: 'userInfo',
      params: [pool.pid, account],
    },
    {
      address: fairLaunchAddress,
      name: 'pendingHusky',
      params: [pool.pid, account],
    },
    {
      address: fairLaunchAddress,
      name: 'pendingHusky',
      params: [pool.debtPid, account],
    }
  ]
}
export const fetchFairLaunchUserDatas = async (account: string, poolsToFetch: PoolsConfig[]): Promise<any[]> => {
  const fairLaunchCalls = poolsToFetch.map((poolToFetch) => fairLaunchUserCalls(account, poolToFetch))
  return fetchDatas(fairLaunchABI, fairLaunchCalls, poolsToFetch.length)
}