import vaultABI from 'config/abi/vault.json'
import { PoolsConfig } from 'config/constants/types'
import { getAddress, getFairLaunchAddress } from 'utils/addressHelpers'
import { Pool } from '../types'
import { fetchDatas } from '../helpers'

const fairLaunchAddress = getFairLaunchAddress()

const vaultFarmCalls = (poolToFetch: Pool) => {
  const { pool } = poolToFetch
  const vaultAddresses = getAddress(pool.address)

  return [
    {
      address: vaultAddresses,
      name: 'totalSupply',
    },
    {
      address: vaultAddresses,
      name: 'totalToken',
    },
    {
      address: vaultAddresses,
      name: 'vaultDebtVal',
    },
    {
      address: vaultAddresses,
      name: 'lastAccrueTime',
    },
    {
      address: vaultAddresses,
      name: 'pendingInterest',
      params: [0],
    },
    {
      address: vaultAddresses,
      name: 'balanceOf',
      params: [fairLaunchAddress],
    }
  ]
}

export const fetchVaultDatas = async (poolsToFetch: PoolsConfig[]): Promise<any[]> => {
  const vaultCalls = poolsToFetch.map((poolToFetch) => vaultFarmCalls(poolToFetch))

  return fetchDatas(vaultABI, vaultCalls, poolsToFetch.length)
}


const vaultUserCalls = (account: string, poolToFetch: Pool) => {
  const { pool } = poolToFetch
  const vaultAddress = getAddress(pool.address)
  return [
    {
      address: vaultAddress,
      name: 'balanceOf',
      params: [account],
    },
    {
      address: vaultAddress,
      name: 'allowance',
      params: [account, getFairLaunchAddress()]
    },
    {
      address: vaultAddress,
      name: 'positionsOfOwner',
      params: [account],
    }
  ]
}

export const fetchVaultUserDatas = async (account: string, poolsToFetch: PoolsConfig[]): Promise<any[]> => {
  const vaultCalls = poolsToFetch.map((poolToFetch) => vaultUserCalls(account, poolToFetch))

  return fetchDatas(vaultABI, vaultCalls, poolsToFetch.length)
}
