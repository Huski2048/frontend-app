/* eslint-disable no-restricted-properties */
import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, BIG_ZERO } from 'config/index';

export const getAprData = (
  totalToken,
  vaultDebtVal,
  poolLendPerBlock,
  tokenPriceUsd,
  tokenReserveFund,
  huskyPriceBusd,
  borrowingInterest?) => {
  // const { totalToken, vaultDebtVal, poolLendPerBlock, tokenPriceUsd, tokenReserveFund } = farm

  const utilization: any = Number(totalToken) !== 0 ? new BigNumber(vaultDebtVal).div(new BigNumber(totalToken)) : BIG_ZERO;
  const reserveFund = parseInt(tokenReserveFund) / 10000;
  const lendApr = borrowingInterest * utilization * (1 - reserveFund)

  const poolHuskyPerBlockPrice = new BigNumber(poolLendPerBlock).times(new BigNumber(huskyPriceBusd))
  const totalTokenPrice = Number(tokenPriceUsd) !== 0 && Number(totalToken) !== 0 ? new BigNumber(totalToken).times(new BigNumber(tokenPriceUsd)) : BIG_ZERO;
  const stakeApr = Number(totalTokenPrice) !== 0 ? BLOCKS_PER_YEAR.times(new BigNumber(poolHuskyPerBlockPrice)).div(new BigNumber(totalTokenPrice)) : BIG_ZERO
  const totalApr = BigNumber.sum(lendApr, stakeApr);
  const apy = Math.pow(1 + totalApr.toNumber() / 365, 365) - 1;

  return { lendApr, stakeApr, totalApr, apy };
}


