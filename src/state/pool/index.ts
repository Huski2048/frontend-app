import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import poolsConfig from 'config/constants/poolsEx'
import isArchivedPid from 'utils/farmHelpers'
import { PoolState, Pool } from '../types'
import fetchPools from './fetchPools'
import { fetchFairLaunchUserDatas } from './fetchFairLaunchData'
import { fetchVaultUserDatas } from './fetchVaultData'

const noAccountFarmConfig = poolsConfig.map((stake) => ({
  ...stake,
  fairLaunchData: {
    poolAllocPoint: '0',
    debtPoolAllocPoint: '0',
    huskyPerBlock: '0',
    totalAllocPoint: '0'
  },
  vaultConfigData: {
    minDebtSize: '0',
    reservePoolBps: '0',
  },
  vaultData: {
    totalSupply: '0',
    totalToken: '0',
    vaultDebtVal: '0',
    interestRatePerYear: '0',
    totalStaked: '0'
  },
  userData: {
    ibTokenBalance: '0',
    ibTokenAllowance: '0',
    positionsOfOwner: [],
    fairLaunchAmount: '0',
    earnedHuski: '0',
    earningHuski: '0',
  },
}))

const initialState: PoolState = { data: noAccountFarmConfig, loadArchivedFarmsData: false, userDataLoaded: false }

export const nonArchivedFarms = poolsConfig.filter(({ pid }) => !isArchivedPid(pid))

// Async thunks
export const fetchPoolPublicDataAsync =
  createAsyncThunk<Pool[], number[]>(
    'pool/fetchPoolPublicDataAsync',
    async (pids) => {
      const poolsToFetch = poolsConfig.filter((poolConfig) => pids.includes(poolConfig.pool.pid))

      const farms = await fetchPools(poolsToFetch)
      return farms
    }
  ,
  )

export const fetchPoolUserDataAsync =
  createAsyncThunk<any[], { account: string; pids: number[] }>(
    'pool/fetchPoolUserDataAsync',
    async ({ account }) => {
      const userFairLaunchDatas = await fetchFairLaunchUserDatas(account, poolsConfig)
      const userVaultDatas = await fetchVaultUserDatas(account, poolsConfig)

      return poolsConfig.map((pool, index) => {
        const [ibTokenBalance, ibTokenAllowance, positionsOfOwner] = userVaultDatas[index]
        const [fairLaunchInfo, earnedHuski, earningHuski] = userFairLaunchDatas[index]

        const positionsList = []
        for (let i = 0; i < positionsOfOwner[0].length; i++) {
          positionsList.push(parseInt(positionsOfOwner[0][i]._hex))
        }
        return {
          pid: pool.pid,
          ibTokenBalance: ibTokenBalance[0]._hex,
          ibTokenAllowance: ibTokenAllowance[0]._hex,
          positionsOfOwner: positionsList,
          fairLaunchAmount: fairLaunchInfo.amount._hex,
          earnedHuski: earnedHuski[0]._hex,
          earningHuski: earningHuski[0]._hex
        }
      })
    }
  ,
  )

export const poolSlice = createSlice({
  name: 'pool',
  initialState,
  reducers: {
    setLoadArchivedFarmsData: (state, action) => {
      const loadArchivedFarmsData = action.payload
      state.loadArchivedFarmsData = loadArchivedFarmsData
    },
  },
  extraReducers: (builder) => {
    // Update farms with live data
    builder.addCase(fetchPoolPublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((stake) => {
        const liveFarmData = action.payload.find((farmData) => farmData.pid === stake.pid)
        return { ...stake, ...liveFarmData }
      })
    })

    // Update farms with user data
    builder.addCase(fetchPoolUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { pid } = userDataEl
        const index = state.data.findIndex((stake) => stake.pid === pid)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    })
  },
})

// Actions
export const { setLoadArchivedFarmsData } = poolSlice.actions

export default poolSlice.reducer
