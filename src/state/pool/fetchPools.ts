import BigNumber from 'bignumber.js'
import { PER_YEAR } from 'config'
import { PoolsConfig } from 'config/constants/types'
import { fetchFairLaunchDatas } from './fetchFairLaunchData'
import { fetchVaultConfigDatas } from './fetchVaultConfigData'
import { fetchVaultDatas } from './fetchVaultData'

const fetchPools = async (poolsToFetch: PoolsConfig[]) => {
  const farmsFairLaunchDatas = await fetchFairLaunchDatas(poolsToFetch)
  const farmsVaultConfigDatas = await fetchVaultConfigDatas(poolsToFetch)
  const farmsVaultDatas = await fetchVaultDatas(poolsToFetch)

  return poolsToFetch.map((farm, index) => {
    const [poolInfo, debtPoolInfo, farmshuskyPerBlock, farmstotalAllocPoint] = farmsFairLaunchDatas[index]
    const [minDebtSize, reservePoolBps] = farmsVaultConfigDatas[index]
    const [totalSupply, totalToken, vaultDebtVal, lastAccrueTime, pendingInterest, totalStaked] = farmsVaultDatas[index]

    const timePast = Date.now()/1000 - Number(lastAccrueTime)
    const interestRatePerYear =  new BigNumber(pendingInterest).times(PER_YEAR).div(new BigNumber(vaultDebtVal)).div(new BigNumber(timePast))
    
    return {
      ...farm,
      fairLaunchData: {
        poolAllocPoint: poolInfo.allocPoint._hex,
        debtPoolAllocPoint: debtPoolInfo.allocPoint._hex,
        huskyPerBlock: farmshuskyPerBlock[0]._hex,
        totalAllocPoint: farmstotalAllocPoint[0]._hex
      },
      vaultConfigData: {
        minDebtSize: minDebtSize[0]._hex,
        reservePoolBps: reservePoolBps[0]._hex,
      },
      vaultData: {
        totalSupply: totalSupply[0]._hex,
        totalToken: totalToken[0]._hex,
        vaultDebtVal: vaultDebtVal[0]._hex,
        interestRatePerYear: interestRatePerYear.toJSON(),
        totalStaked: totalStaked[0]._hex
      }
    }
  })
}

export default fetchPools
