/* eslint-disable no-restricted-properties */
import { Pool } from 'state/types'
import { BLOCKS_PER_YEAR, BIG_ZERO } from 'config/index';
import BigNumber from 'bignumber.js';

export const getStakeApy = (pool: Pool, huskyPriceBusd, tokenPriceBusd) => {
  const { vaultData, fairLaunchData, } = pool
  const totalToken = vaultData ? new BigNumber(vaultData.totalToken) : BIG_ZERO

  const busdTokenPrice: any = tokenPriceBusd;
  const huskyPrice: any = huskyPriceBusd;
  const poolHuskyPerBlock = fairLaunchData ? new BigNumber(fairLaunchData.huskyPerBlock).times(new BigNumber(fairLaunchData.poolAllocPoint)).div(new BigNumber(fairLaunchData.totalAllocPoint)) : BIG_ZERO
  // const stakeApr = BLOCKS_PER_YEAR.times(poolHuskyPerBlock * huskyPrice).div(
  //   (busdTokenPrice * parseInt(totalToken) * parseInt(totalToken)) / parseInt(totalSupply)
  // );
  const stakeApr = totalToken.comparedTo(BIG_ZERO) > 0 ? BLOCKS_PER_YEAR.times(poolHuskyPerBlock.times(huskyPrice)).div((totalToken.times(busdTokenPrice))) : BIG_ZERO
  const apy = Math.pow(1 + stakeApr.toNumber() / 365, 365) - 1;
  return { stakeApr, apy };
}
