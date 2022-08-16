import ethers, { Contract, ContractFunction } from 'ethers'

export type MultiCallResponse<T> = T | null

// Predictions
export type PredictionsClaimableResponse = boolean

export interface PredictionsLedgerResponse {
  position: 0 | 1
  amount: ethers.BigNumber
  claimed: boolean
}

export type PredictionsRefundableResponse = boolean

export interface PredictionsRoundsResponse {
  epoch: ethers.BigNumber
  startTimestamp: ethers.BigNumber
  lockTimestamp: ethers.BigNumber
  closeTimestamp: ethers.BigNumber
  lockPrice: ethers.BigNumber
  closePrice: ethers.BigNumber
  lockOracleId: ethers.BigNumber
  closeOracleId: ethers.BigNumber
  totalAmount: ethers.BigNumber
  bullAmount: ethers.BigNumber
  bearAmount: ethers.BigNumber
  rewardBaseCalAmount: ethers.BigNumber
  rewardAmount: ethers.BigNumber
  oracleCalled: boolean
}

// Note: slightly different from AuctionStatus used throughout UI
export enum FarmAuctionContractStatus {
  Pending,
  Open,
  Close,
}

export interface AuctionsResponse {
  status: FarmAuctionContractStatus
  startBlock: ethers.BigNumber
  endBlock: ethers.BigNumber
  initialBidAmount: ethers.BigNumber
  leaderboard: ethers.BigNumber
  leaderboardThreshold: ethers.BigNumber
}

export interface BidsPerAuction {
  account: string
  amount: ethers.BigNumber
}

export type ViewBidsPerAuctionResponse = [BidsPerAuction[], ethers.BigNumber]

// [auctionId, bids, claimed, nextCursor]
export type ViewBidderAuctionsResponse = [ethers.BigNumber[], ethers.BigNumber[], boolean[], ethers.BigNumber]


