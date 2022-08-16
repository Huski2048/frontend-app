import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'
import { useDispatch } from 'react-redux'
import leverageReducer from './leverage'
import poolReducer from './pool'
import blockReducer from './block'
import { updateVersion } from './global/actions'
import graphReducer from './graph'
import user from './user/reducer'
import transactions from './transactions/reducer'
import multicall from './multicall/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions']

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    block: blockReducer,
    leverage: leverageReducer,
    pool: poolReducer,
    graph:graphReducer,

    // Exchange
    user,
    transactions,
    multicall,
  },
  middleware: [...getDefaultMiddleware({ thunk: true }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS }),
})

store.dispatch(updateVersion())

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch()

export default store
