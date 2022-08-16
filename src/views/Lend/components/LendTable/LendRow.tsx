import React from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints, Flex } from 'husky-uikit'
import { useFarmTokenBalance, useHuskiPrice, useTokenPrice } from 'state/leverage/hooks'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getBalanceAmount } from 'utils/formatBalance'
import { usePoolFairLaunchData, usePoolUserData, usePoolVaultConfigData, usePoolVaultData } from 'state/pool/hooks'
import BigNumber from 'bignumber.js'
import NameCell from './Cells/NameCell'
import { getAprData } from '../../helpers'
import UtilRateCell from './Cells/UtilRateCell'
import ApyCell from './Cells/ApyCell'
import TotalSupplyCell from './Cells/TotalSupplyCell'
import TotalBorrowedCell from './Cells/TotalBorrowedCell'
import BalanceCell from './Cells/BalanceCell'
import ActionCell from './Cells/ActionCell'

const StyledRow = styled(Flex)`
  flex-direction: row;
  height: 67.5px;
  padding: 0 15px;
  align-items: center;
  justify-content: space-between;
  margin-top: 7.5px;
  ${({ theme }) => theme.screen.tablet} {
    padding: 0 15px;
    height: 44.82px;
    margin-top: 0px;
    margin-bottom: 23px;
  }
  ${({ theme }) => theme.screen.phone} {
    flex-direction: column;
    padding: 10px 20px;
    height: auto;
    border-bottom: 1px solid ${({ theme }) => theme.color.tableLine};
    :last-child {
      border-bottom: 0;
    }
  }
  &:hover {
    background: ${({ theme }) => (theme.isDark ? '#272B30' : '#F7F7F8')};
  }
  &:active {
    background: ${({ theme }) => (theme.isDark ? '#272B30' : '#F7F7F8')};
  }
`

const LendRow = ({ lendData }) => {
  const huskyPrice = useHuskiPrice()
  const { balance: bnbBalance } = useGetBnbBalance()
  const tokenName = lendData.name // lendData?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
  const tokenPriceUsd = useTokenPrice(lendData.token.coingeckoId)
  const { tokenBalance } = useFarmTokenBalance(lendData.token.coingeckoId)
  const { totalToken, totalSupply, vaultDebtVal, interestRatePerYear } = usePoolVaultData(lendData.pool.pid)
  const { ibTokenBalance } = usePoolUserData(lendData.pool.pid)
  const { poolRewardPerBlock } = usePoolFairLaunchData(lendData.pool.pid)
  const { reservePoolBps } = usePoolVaultConfigData(lendData.pool.pid)

  const totalSupplyUSD = Number(totalToken) * Number(tokenPriceUsd)
  const totalBorrowedUSD = Number(vaultDebtVal) * Number(tokenPriceUsd)
  const userTokenBalance = getBalanceAmount(lendData.token.symbol.toLowerCase() === 'wbnb' ? bnbBalance : new BigNumber(tokenBalance))
  const { isTablet } = useMatchBreakpoints()

  return (
    <StyledRow role="row">
      <NameCell token={lendData.token} exchangeRate={totalToken.div(totalSupply)} />
      <ApyCell getApyData={getAprData(totalToken, vaultDebtVal, poolRewardPerBlock, tokenPriceUsd, reservePoolBps, huskyPrice, interestRatePerYear)} token={lendData} />
      <TotalSupplyCell supply={Number(totalToken)} supplyUSD={totalSupplyUSD} name={tokenName} />
      {isTablet ? null : (
        <>
          <TotalBorrowedCell borrowed={Number(vaultDebtVal)} borrowedUSD={totalBorrowedUSD} name={tokenName} />
          <UtilRateCell utilRate={totalToken.comparedTo(0) > 0 ? vaultDebtVal.div(totalToken) : 0} />
        </>
      )}
      <BalanceCell
        balance={userTokenBalance}
        balanceIb={getBalanceAmount(ibTokenBalance)}
        name={tokenName}
        decimals={lendData.token.decimalsDigits}
      />
      <ActionCell lendData={lendData} />
    </StyledRow>
  )
}

export default LendRow
