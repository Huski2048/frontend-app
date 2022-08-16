
/**
 * Get the APR value in %
 * @param yieldFarmData Pool current yield farm data
 * @param tradeFee Pool current trading fee
 * @param huskyRewards Huski rewards
 * @param borrowingInterest Borrowing interest about lp 
 * @param lvg Pool current leverage
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  yieldFarmData: number,
  tradeFee: number,
  huskyRewards: number,
  borrowingInterest: any,
  lvg: number,
): number => {

  // resolve data change loading 
  // Number(huskyRewards) === 0 ||
  //  Number.isNaN(huskyRewards) ||
  // if (
  //   Number(tradeFee) === 0 ||
  //   Number(borrowingInterest) === 0 ||
  //   Number(yieldFarmData) === 0 ||
  //   Number.isNaN(tradeFee) ||

  //   Number.isNaN(borrowingInterest) ||
  //   Number.isNaN(yieldFarmData)
  // ) {
  //   return null
  // }

  const apr =
    Number(((yieldFarmData || 0) / 100) * lvg) +
    Number((((tradeFee || 0) * 365) / 100) * lvg) +
    Number((huskyRewards || 0) * (lvg - 1)) -
    Number((Number(borrowingInterest) || 0) * (lvg - 1))

  return apr // .isNaN() || !apr.isFinite() ? null : apr.toNumber()
}


export default null
