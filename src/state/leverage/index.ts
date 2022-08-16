import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import leverageFarmsConfig from 'config/constants/leverage'
import leverageFarmsConfig from 'config/constants/farms'
import isArchivedPid from 'utils/farmHelpers'
import fetchFarmsEx from './fetchFarmsEx'
import fetchFarmsPrices from './fetchFarmsPrices'
import { LeverageFarmsState, LeverageFarm } from '../types'
import { fetchTokenUserDatas } from './fetchTokenData'


const noAccountFarmConfig = leverageFarmsConfig.map((farm) => ({
  ...farm,
  masterChefData: {
    poolAllocPoint: '0',
    totalAllocPoint: '0',
    userInfo: '0',
  },
  tokensLpData: {
    tokenLpBalance: '0',
    quoteTokenLpBalance: '0',
    tokenDecimals: 18,
    quoteTokenDecimals: 18,
  },
  pancakeLpData: {
    totalSupply: '0',
    tokenReserve: '0',
    quoteTokenReserve: '0',
  },
  userData: {
    tokenBalance: '0',
    quoteTokenBalance: '0',
    tokenAllowance: '0',
    quoteTokenAllowance: '0',
  }
}))

const initialState: LeverageFarmsState = { data: noAccountFarmConfig, loadArchivedFarmsData: false, userDataLoaded: false, tradingDataLoaded: false }

export const nonArchivedFarms = leverageFarmsConfig.filter(({ pid }) => !isArchivedPid(pid))

// Async thunks
export const fetchLeverageFarmsPublicDataAsync =
  createAsyncThunk<LeverageFarm[]>(
    'leverage/fetchLeverageFarmsPublicDataAsync',
    async () => {
      // const farmsToFetch = leverageFarmsConfig.filter((farmConfig) => pids.includes(farmConfig.pid))

      const farms = await fetchFarmsEx(leverageFarmsConfig)
      const farmsWithPrices = await fetchFarmsPrices(farms)

      // Filter out price helper LP config farms
      const farmsWithoutHelperLps = farmsWithPrices.filter((farm: LeverageFarm) => {
        return farm.pid || farm.pid === 0
      })
      return farmsWithoutHelperLps
    }
  ,
  )

export const fetchLeverageFarmUserDataAsync =
  createAsyncThunk<any[], { account: string; pids: number[] }>(
    'leverage/fetchLeverageFarmUserDataAsync',
    async ({ account }) => {
      const userTokenDatas = await fetchTokenUserDatas(account, leverageFarmsConfig)

      return leverageFarmsConfig.map((farm, index) => {
        const [tokenBalance, quoteTokenBalance, tokenAllowance, quoteTokenAllowance] = userTokenDatas[index]
        return {
          pid: farm.pid,
          fairLaunchPid: farm.pool.pid,
          tokenBalance: tokenBalance.balance._hex,
          quoteTokenBalance: quoteTokenBalance.balance._hex,
          tokenAllowance: tokenAllowance[0]._hex,
          quoteTokenAllowance: quoteTokenAllowance[0]._hex,
        }
      })
    }
  ,
  )

export const leverageSlice = createSlice({
  name: 'leverage',
  initialState,
  reducers: {
    setLoadArchivedFarmsData: (state, action) => {
      const loadArchivedFarmsData = action.payload
      state.loadArchivedFarmsData = loadArchivedFarmsData
    },
  },
  extraReducers: (builder) => {
    // Update farms with live data
    builder.addCase(fetchLeverageFarmsPublicDataAsync.fulfilled, (state, action) => {
      state.data = state.data.map((farm) => {
        const liveFarmData = action.payload.find((farmData) => farmData.pid === farm.pid && farmData.pool.pid === farm.pool.pid)
        return { ...farm, ...liveFarmData }
      })
      state.loadArchivedFarmsData = true
    })

    // Update farms with user data
    builder.addCase(fetchLeverageFarmUserDataAsync.fulfilled, (state, action) => {
      action.payload.forEach((userDataEl) => {
        const { pid, fairLaunchPid } = userDataEl
        const index = state.data.findIndex((farm) => farm.pid === pid && farm.pool.pid === fairLaunchPid)
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
      state.userDataLoaded = true
    })


  },
})

// Actions
export const { setLoadArchivedFarmsData } = leverageSlice.actions

export default leverageSlice.reducer
