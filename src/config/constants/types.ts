import BigNumber from 'bignumber.js'
import { SerializedBigNumber, TranslatableText } from 'state/types'

export interface Address {
  97?: string
  56?: string
}

export interface Token {
  symbol: string
  address?: Address
  decimals?: number
  decimalsDigits?: number
  projectLink?: string
  coingeckoId?: string
}

export interface Pool {
  symbol: string
  pid: number
  debtPid: number
  address: Address
  config: Address
}

export enum PoolIds {
  poolBasic = 'poolBasic',
  poolUnlimited = 'poolUnlimited',
}

export type IfoStatus = 'idle' | 'coming_soon' | 'live' | 'finished'

interface IfoPoolInfo {
  saleAmount: string
  raiseAmount: string
  cakeToBurn: string
  distributionRatio: number // Range [0-1]
}

export interface Ifo {
  id: string
  isActive: boolean
  address: string
  name: string
  currency: Token
  token: Token
  releaseBlockNumber: number
  articleUrl: string
  campaignId: string
  tokenOfferingPrice: number
  version: number
  [PoolIds.poolBasic]?: IfoPoolInfo
  [PoolIds.poolUnlimited]: IfoPoolInfo
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
  'AUTO' = 'Auto',
}

export interface FarmConfig {
  pid: number
  lpSymbol: string
  lpAddresses: Address
  token: Token
  quoteToken: Token
  multiplier?: string
  isCommunity?: boolean
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
}

export interface PoolsConfig {
  name: string
  pid: number
  token?: Token
  pool?: Pool
}

export interface LeverageFarmConfig {
  pid: number
  lpSymbol: string
  lpAddresses: Address
  lpExchange?:string
  duplicate: number
  singleFlag?:number
  switchFlag:number
  leverage: number
  token: Token
  quoteToken: Token
  pool: Pool
  workerAddress: string
  config: string
  strategies: {
    StrategyAddAllBaseToken: string
    StrategyLiquidate: string
    StrategyAddTwoSidesOptimal: string
    StrategyWithdrawMinimizeTrading: string
    StrategyPartialCloseLiquidate: string
    StrategyPartialCloseMinimizeTrading: string
  }
}


export type Images = {
  lg: string
  md: string
  sm: string
  ipfs?: string
}

export type NftImages = {
  blur?: string
} & Images

export type NftVideo = {
  webm: string
  mp4: string
}

export type NftSource = {
  [key in NftType]: {
    address: Address
    identifierKey: string
  }
}

export enum NftType {
  PANCAKE = 'pancake',
  MIXIE = 'mixie',
}

export type Nft = {
  description: string
  name: string
  images: NftImages
  sortOrder: number
  type: NftType
  video?: NftVideo

  // Uniquely identifies the nft.
  // Used for matching an NFT from the config with the data from the NFT's tokenURI
  identifier: string

  // Used to be "bunnyId". Used when minting NFT
  variationId?: number | string
}

export type TeamImages = {
  alt: string
} & Images

export type Team = {
  id: number
  name: string
  description: string
  isJoinable?: boolean
  users: number
  points: number
  images: TeamImages
  background: string
  textColor: string
}

export type CampaignType = 'ifo' | 'teambattle' | 'participation'

export type Campaign = {
  id: string
  type: CampaignType
  title?: TranslatableText
  description?: TranslatableText
  badge?: string
}

export type PageMeta = {
  title: string
  description?: string
  image?: string
}

export enum LotteryStatus {
  PENDING = 'pending',
  OPEN = 'open',
  CLOSE = 'close',
  CLAIMABLE = 'claimable',
}

export interface LotteryTicket {
  id: string
  number: string
  status: boolean
  rewardBracket?: number
  roundId?: string
  cakeReward?: SerializedBigNumber
}

export interface LotteryTicketClaimData {
  ticketsWithUnclaimedRewards: LotteryTicket[]
  allWinningTickets: LotteryTicket[]
  cakeTotal: BigNumber
  roundId: string
}

// Farm Auction
export interface FarmAuctionBidderConfig {
  account: string
  farmName: string
  tokenAddress: string
  quoteToken: Token
  tokenName: string
  projectSite?: string
  lpAddress?: string
}

// Note: this status is slightly different compared to 'status' comfing
// from Farm Auction smart contract
export enum AuctionStatus {
  ToBeAnnounced, // No specific dates/blocks to display
  Pending, // Auction is scheduled but not live yet (i.e. waiting for startBlock)
  Open, // Auction is open for bids
  Finished, // Auction end block is reached, bidding is not possible
  Closed, // Auction was closed in smart contract
}

export interface Auction {
  id: number
  status: AuctionStatus
  startBlock: number
  startDate: Date
  endBlock: number
  endDate: Date
  auctionDuration: number
  farmStartBlock: number
  farmStartDate: Date
  farmEndBlock: number
  farmEndDate: Date
  initialBidAmount: number
  topLeaderboard: number
  leaderboardThreshold: BigNumber
}

export interface BidderAuction {
  id: number
  amount: BigNumber
  claimed: boolean
}

export interface Bidder extends FarmAuctionBidderConfig {
  position?: number
  isTopPosition: boolean
  samePositionAsAbove: boolean
  amount: BigNumber
}

export interface ConnectedBidder {
  account: string
  isWhitelisted: boolean
  bidderData?: Bidder
}
