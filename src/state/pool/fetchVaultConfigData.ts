import vaultConfigABI from 'config/abi/SimpleVaultConfig.json'
import { getAddress } from 'utils/addressHelpers'
import { PoolsConfig } from 'config/constants/types'
import { Pool } from '../types'
import { fetchDatas } from '../helpers'

const vaultConfigFarmCalls = (poolToFetch: Pool) => {
  const { pool } = poolToFetch
  return [
    {
      address: getAddress(pool.config),
      name: 'minDebtSize',
    },
    {
      address: getAddress(pool.config),
      name: 'getReservePoolBps',
    }
  ]
}

export const fetchVaultConfigDatas = async (poolsToFetch: PoolsConfig[]): Promise<any[]> => {
  const vaultConfigCalls = poolsToFetch.map((poolToFetch) => vaultConfigFarmCalls(poolToFetch))
  
  return fetchDatas(vaultConfigABI, vaultConfigCalls, poolsToFetch.length)
}