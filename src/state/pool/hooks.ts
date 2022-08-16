import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'config/index'
import useRefresh from 'hooks/useRefresh'
import { poolsConfig } from 'config/constants'
import { fetchPoolPublicDataAsync, fetchPoolUserDataAsync, nonArchivedFarms } from '.'
import { State, Pool, PoolState } from '../types'

export const usePollPoolsPublicData = (includeArchive = true) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const poolsToFetch = includeArchive ? poolsConfig : nonArchivedFarms
    const pids = poolsToFetch.map((poolToFetch) => poolToFetch.pid)

    dispatch(fetchPoolPublicDataAsync(pids))
  }, [includeArchive, dispatch, slowRefresh])
}

export const usePollPoolsWithUserData = (includeArchive = true) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const poolsToFetch = includeArchive ? poolsConfig : nonArchivedFarms
    const pids = poolsToFetch.map((poolToFetch) => poolToFetch.pid)

    // dispatch(fetchPoolPublicDataAsync(pids))
    if (account) {
      dispatch(fetchPoolUserDataAsync({ account, pids }))
    }
  }, [includeArchive, dispatch, slowRefresh, account])
}

export const usePools = (): PoolState => {
  const pools = useSelector((state: State) => state.pool)
  return pools
}

export const usePoolFromPid = (pid): Pool => {
  const pool = useSelector((state: State) => state.pool.data.find((f) => f.pid === pid))
  return pool
}


export const usePoolVaultData = (pid) => {
  const pool = usePoolFromPid(pid)

  return {
    totalSupply: pool.vaultData ? new BigNumber(pool.vaultData.totalSupply) : BIG_ZERO,
    totalToken: pool.vaultData ? new BigNumber(pool.vaultData.totalToken) : BIG_ZERO,
    totalStaked: pool.vaultData ? new BigNumber(pool.vaultData.totalStaked) : BIG_ZERO,
    vaultDebtVal: pool.vaultData ? new BigNumber(pool.vaultData.vaultDebtVal) : BIG_ZERO,
    interestRatePerYear: pool.vaultData ? new BigNumber(pool.vaultData.interestRatePerYear) : BIG_ZERO,
  }
}
export const usePoolUserData = (pid) => {
  const pool = usePoolFromPid(pid)

  return {
    ibTokenAllowance: pool.userData ? new BigNumber(pool.userData.ibTokenAllowance) : BIG_ZERO,
    ibTokenBalance: pool.userData ? new BigNumber(pool.userData.ibTokenBalance) : BIG_ZERO,
    fairLaunchAmount: pool.userData ? new BigNumber(pool.userData.fairLaunchAmount) : BIG_ZERO,
    earnedHuski: pool.userData ? new BigNumber(pool.userData.earnedHuski) : BIG_ZERO,
  }
}

export const usePoolVaultConfigData = (pid) => {
  const pool = usePoolFromPid(pid)

  return {
    minDebtSize: pool.vaultConfigData.minDebtSize,
    reservePoolBps: pool.vaultConfigData.reservePoolBps,
  }
}

export const usePoolFairLaunchData = (pid) => {
  const pool = usePoolFromPid(pid)
  const huskyPerBlock = pool?.fairLaunchData.huskyPerBlock
  const totalAllocPointFL = pool.fairLaunchData.totalAllocPoint

  const huskiTotalRatio = Number(totalAllocPointFL) !== 0 ? new BigNumber(huskyPerBlock).div(new BigNumber(totalAllocPointFL)) : BIG_ZERO;
  const poolRewardPerBlock = Number(huskiTotalRatio) !== 0 ? new BigNumber(huskiTotalRatio).times(new BigNumber(pool.fairLaunchData.poolAllocPoint)) : BIG_ZERO;
  const debtPoolRewardPerBlock = Number(huskiTotalRatio) !== 0 ? new BigNumber(huskiTotalRatio).times(new BigNumber(pool.fairLaunchData.debtPoolAllocPoint)) : BIG_ZERO;

  return {
    poolRewardPerBlock: poolRewardPerBlock.toJSON(),
    debtPoolRewardPerBlock: debtPoolRewardPerBlock.toJSON(),
  }
}

export const usePoolVaultFromCoingeckoId = (coingeckoId: string) => {
  const pool = useSelector((state: State) => state.pool.data.find((f) => f.token.coingeckoId === coingeckoId))
  return {
    vaultAddress: pool.pool.address,
    vaultConfig: pool.pool.config,
  }
}
