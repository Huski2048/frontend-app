/* eslint-disable no-unused-expressions */
import BigNumber from 'bignumber.js'

export const useGetTotalValueLocked = (lpTokensTvl,farmsData, lendDatas) => {
  let depositTotalToken = new BigNumber(0)
  let depositTotalDebtVal = new BigNumber(0)
  lendDatas.map((pool) => {
    const { totalToken, vaultDebtVal } = pool.vaultData
    const farm = farmsData.find((f) => f.token.coingeckoId === pool.token.coingeckoId)
    const tokenPriceUsd = farm?.tokenPriceUsd
    const totalSupplyUSD = new BigNumber(totalToken).multipliedBy(new BigNumber(tokenPriceUsd)).dividedBy(new BigNumber(10).exponentiatedBy(new BigNumber(18)))
    const totalBorrowedUSD = new BigNumber(vaultDebtVal).multipliedBy(new BigNumber(tokenPriceUsd)).dividedBy(new BigNumber(10).exponentiatedBy(new BigNumber(18)))
    depositTotalToken = depositTotalToken.plus(totalSupplyUSD)
    depositTotalDebtVal = depositTotalDebtVal.plus(totalBorrowedUSD)
    return { depositTotalToken, depositTotalDebtVal }
  })

   const totalValueLocked = Number(lpTokensTvl) + Number(depositTotalToken) - Number(depositTotalDebtVal)

  return totalValueLocked
}
