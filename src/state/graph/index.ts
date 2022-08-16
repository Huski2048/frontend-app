import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GraphState } from '../types'

const initialState: GraphState = { tradingFees: [], volume24hs: [] }

export const graphSlice = createSlice({
    name: 'Graph',
    initialState,
    reducers: {
        setTradingFee: (state, action: PayloadAction<any[]>) => {
            state.tradingFees = action.payload
        },
        setVolume24h: (state, action: PayloadAction<any[]>) => {
            state.volume24hs = action.payload
        },
    },
})

export const { setTradingFee } = graphSlice.actions
export const { setVolume24h } = graphSlice.actions

export default graphSlice.reducer