import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_TEN, BIG_ZERO } from 'config/index'
import { leverageFarmsConfig } from 'config/constants'
import useRefresh from 'hooks/useRefresh'
import { getWorkerConfigContract } from 'utils/contractHelpers'
import { fetchLeverageFarmsPublicDataAsync, fetchLeverageFarmUserDataAsync, nonArchivedFarms } from '.'
import { State, LeverageFarm, LeverageFarmsState } from '../types'

export const usePollLeverageFarmsPublicData = (includeArchive = true) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    // const farmsToFetch = includeArchive ? leverageFarmsConfig : nonArchivedFarms
    // const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    dispatch(fetchLeverageFarmsPublicDataAsync())
  }, [includeArchive, dispatch, slowRefresh])
}

export const usePollLeverageFarmsWithUserData = (includeArchive = true) => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const { account } = useWeb3React()

  useEffect(() => {
    const farmsToFetch = includeArchive ? leverageFarmsConfig : nonArchivedFarms
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid)

    // dispatch(fetchLeverageFarmsPublicDataAsync(pids))
    if (account) {
      dispatch(fetchLeverageFarmUserDataAsync({ account, pids }))
    }
  }, [includeArchive, dispatch, slowRefresh, account])
}

export const useLeverageFarms = (): LeverageFarmsState => {
  const farms = useSelector((state: State) => state.leverage)
  return farms
}

export const useFarmFromWorker= (worker): LeverageFarm => {
  const farm = useSelector((state: State) => state.leverage.data.find((f) => f.workerAddress.toLowerCase() === worker.toLowerCase()))
  return farm
}

export const useFarmFromLpPid = (lpPid): LeverageFarm[] => {
  const leverageFarms = useSelector((state: State) => state.leverage)
  const farms = leverageFarms.data.filter((farm: LeverageFarm) => {
    return farm.pid === lpPid
  })
  return farms
}

export const useFarmFromPid = (lpPid, fairLaunchPid): LeverageFarm => {
  const farm = useSelector((state: State) => state.leverage.data.find((f) => f.pid === lpPid && f.pool.pid === fairLaunchPid))
  return farm
}

export const useFarmFromPidAndCoingeckoId = (lpPid, coingeckoId: string): LeverageFarm => {
  const farm = useSelector((state: State) => state.leverage.data.find((f) => f.pid === lpPid && f.token.coingeckoId === coingeckoId))
  return farm
}

export const useFarmFromLpSymbol = (lpSymbol: string): LeverageFarm => {
  const farm = useSelector((state: State) => state.leverage.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmMasterChefData = (pid, fairLaunchPid) => {
  const farm = useFarmFromPid(pid, fairLaunchPid)

  const allocPoint = farm.masterChefData.poolAllocPoint ? new BigNumber(farm.masterChefData.poolAllocPoint) : BIG_ZERO
  const poolWeight = farm.masterChefData.totalAllocPoint ? allocPoint.div(new BigNumber(farm.masterChefData.totalAllocPoint)) : BIG_ZERO
  
  return {
    poolWeight: poolWeight.toJSON(),
    workerInfo: farm.masterChefData.userInfo, // tokenUserInfoLP
  }
}

export const useFarmPancakeLpData = (pid, fairLaunchPid) => {
  const farm = useFarmFromPid(pid, fairLaunchPid)

  return {
    totalSupply: farm.pancakeLpData.totalSupply,
    tokenReserve: farm.pancakeLpData.token0Reserve,
    quoteTokenReserve: farm.pancakeLpData.token1Reserve,
  }
}

export const useFarmTokensLpData = (pid, fairLaunchPid) => {
  const farm = useFarmFromPid(pid, fairLaunchPid)

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio = new BigNumber(farm.pancakeLpData.masterChefBalance).div(new BigNumber(farm.pancakeLpData.totalSupply))

  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = new BigNumber(farm.tokensLpData.tokenLpBalance).div(BIG_TEN.pow(farm.tokensLpData.tokenDecimals))
  const quoteTokenAmountTotal = new BigNumber(farm.tokensLpData.quoteTokenLpBalance).div(BIG_TEN.pow(farm.tokensLpData.quoteTokenDecimals))

  // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
  const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)

  // Total staked in LP, in quote token value
  const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))
  return {
    tokenAmountTotal: tokenAmountTotal.toJSON(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toJSON(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
  }
}

export const useFarmUserData = (pid, fairLaunchPid) => {
  const farm = useFarmFromPid(pid, fairLaunchPid)

  return {
    tokenBalance: farm.userData.tokenBalance,
    tokenAllowance: farm.userData.tokenAllowance,
    quoteTokenBalance: farm.userData.quoteTokenBalance,
    quoteTokenAllowance: farm.userData.quoteTokenAllowance,
  }
}

export const useHuskiPrice = () => {
  const farm = useFarmFromPid(251, 3)

  return farm.tokenPriceUsd
}

export const useCakePrice = () => {
  const farm = useFarmFromPid(251, 3)

  return farm.quoteTokenPriceUsd
}

export const useTokenPrice = (coingeckoId: string) => {
  const farm = useSelector((state: State) => state.leverage.data.find((f) => f.token.coingeckoId === coingeckoId))

  return farm.tokenPriceUsd
}

export const useFarmTokenBalance = (coingeckoId: string) => {
  const farm = useSelector((state: State) => state.leverage.data.find((f) => f.token.coingeckoId === coingeckoId))

  return {
    tokenBalance: farm.userData.tokenBalance,
    tokenAllowance: farm.userData.tokenAllowance,
  }
}

export const useWorkerAcceptDebt = (address: string, worker: string) => {
  const [acceptDebt, setAcceptDebt] = useState(-1)
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchAcceptDebt = async () => {
      const workerConfig = getWorkerConfigContract(address)
      try {
        const isAcceptDebt = await workerConfig.acceptDebt(worker)
        setAcceptDebt(isAcceptDebt)
      } catch (e) {
        // console.error(e)
      }
    }
    fetchAcceptDebt()
  }, [fastRefresh, address, worker])

  return acceptDebt
}

export const useWorkerKillFactor = (address: string, worker: string) => {
  const [killFactor, setKillFactor] = useState(-1)
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchWorkerConfig = async () => {
      const workerConfig = getWorkerConfigContract(address)
      try {
        const killFactorData = await workerConfig.killFactor(worker, 0)
        setKillFactor(killFactorData)
      } catch (e) {
        // console.error(e)
      }
    }
    fetchWorkerConfig()
  }, [fastRefresh, address, worker])

  return killFactor
}
