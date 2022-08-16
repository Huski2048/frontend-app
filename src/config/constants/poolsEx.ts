import pools from './pools'
import tokens from './tokens'
import { PoolsConfig } from './types'

const poolsConfig: PoolsConfig[] = [

  {
    name: 'BNB',
    pid: 3,
    token: tokens.wbnb,
    pool: pools.ibBNB
  },
  {
    name: "BUSD",
    pid: 1,
    token: tokens.busd,
    pool: pools.ibBUSD
  },
  {
    name: "USDT",
    pid: 5,
    token: tokens.usdt,
    pool: pools.ibUSDT
  },
  {
    name: "BTCB",
    pid: 10,
    token: tokens.btcb,
    pool: pools.ibBTCB
  },
  {
    name: "ETH",
    pid: 8,
    token: tokens.eth,
    pool: pools.ibETH
  },
  {
    name: "USDC",
    pid: 12,
    token: tokens.usdc,
    pool: pools.ibUSDC
  },
]

export default poolsConfig
