/* eslint-disable no-unused-expressions */
import React, { useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { Flex, Text, Skeleton, Box } from 'husky-uikit'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { getBalanceAmount } from 'utils/formatBalance'
import { usePoolFairLaunchData, usePoolUserData, usePoolVaultConfigData, usePoolVaultData } from 'state/pool/hooks'
import { useHuskiPrice, useFarmTokenBalance, useTokenPrice } from 'state/leverage/hooks'
// import { useHuskiPrice } from 'utils/api'
import TabPanel from 'components/TabPanel'
import { Paw } from 'assets'
import { getAprData } from '../helpers'
import Deposit from './components/Deposit'
import Withdraw from './components/Withdraw'

interface RouteParams {
  action: string
  tokenName: string
}

interface LocationParams {
  lendData?: any
}

const StyledPage = styled(Page)`
  align-items: center;
  justify-content: center;
  * {
    font-family: 'GenJyuuGothic';
  }
`
const ApyContainer = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  padding: 20px;
  border-radius: 12px;
  width: 100%;
  height: 84px;
  max-width: 480px;
  flex: unset !important;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px !important;
`

const LendAction = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    state: { lendData },
  } = useLocation<LocationParams>()

  const { action, tokenName } = useParams<RouteParams>()
  const [isDeposit, setIsDeposit] = useState(action === 'deposit')

  // const { data: farmsData } = useLeverageFarms()
  // const hash = {}
  // const lendData = farmsData.reduce((cur, next) => {
  //   hash[next.pool.pid] ? '' : (hash[next.pool.pid] = true && cur.push(next))
  //   return cur
  // }, [])

  // const tokenData = lendData.find((item) => item.TokenInfo.token.poolId === token?.TokenInfo.token.poolId)
  // const { allowance: tokenAllowance } = useTokenAllowance(
  //   getAddress(tokenData?.TokenInfo?.token?.address),
  //   tokenData?.TokenInfo?.vaultAddress,
  // )
  // const { tokenPriceUsd } = tokenData
  const { totalToken, totalSupply, vaultDebtVal, interestRatePerYear } = usePoolVaultData(lendData.pool.pid)
  const { poolRewardPerBlock } = usePoolFairLaunchData(lendData.pool.pid)
  const { reservePoolBps } = usePoolVaultConfigData(lendData.pool.pid)
  const { ibTokenBalance } = usePoolUserData(lendData.pool.pid)
  const tokenPriceUsd = useTokenPrice(lendData.token.coingeckoId)
  const { tokenBalance, tokenAllowance } = useFarmTokenBalance(lendData.token.coingeckoId)

  // const allowance = Number(token?.userData?.allowance) > 0 ? token?.userData?.allowance : tokenAllowance.toString()

  // const { balance: tokenBalance } = useTokenBalance(getAddress(tokenData.TokenInfo.token.address))
  const { balance: bnbBalance } = useGetBnbBalance()
  const userTokenBalanceIb = getBalanceAmount(ibTokenBalance)
  const userTokenBalance = getBalanceAmount(tokenName.toLowerCase() === 'bnb' ? bnbBalance : new BigNumber(tokenBalance))

  const exchangeRate =totalToken.div(totalSupply)
  const huskyPrice = useHuskiPrice()
  const { apy } = getAprData(totalToken, vaultDebtVal, poolRewardPerBlock, tokenPriceUsd, reservePoolBps, huskyPrice, interestRatePerYear)
  const apyCell = (e: number) => {
    const value = e * 100
    return `${value.toFixed(2)}%`
  }

  const capitalize = (string: string) => (string && string[0].toUpperCase() + string.slice(1)) || ''

  return (
    <StyledPage>
      <Paw width="40px" height="40px" />
      <Text fontSize="20px" lineHeight="48px" mb="4px !important" fontWeight={700}>
        {t(`${capitalize(action)}`)} {action.toLowerCase() === 'withdraw' ? `ib${tokenName}` : tokenName}
      </Text>
      <TabPanel
        tabOne={{ name: t('Deposit'), path: `/lend/deposit/${tokenName}`, setActive: () => setIsDeposit(true) }}
        tabTwo={{ name: t('Withdraw'), path: `/lend/withdraw/${tokenName}`, setActive: () => setIsDeposit(false) }}
        currentTab={isDeposit ? t('deposit') : t('withdraw')}
        replace
        p="20px"
        maxWidth="480px"
        width="100%"
        mb="20px !important"
      >
        <Box mt="21px">
          {isDeposit ? (
            <Deposit
              name={tokenName}
              allowance={tokenAllowance}
              exchangeRate={exchangeRate}
              tokenData={lendData.token}
              account={account}
              userTokenBalance={userTokenBalance}
              userTokenBalanceIb={userTokenBalanceIb}
            />
          ) : (
            <Withdraw
              name={tokenName}
              exchangeRate={exchangeRate}
              account={account}
              tokenData={lendData.token}
              userTokenBalanceIb={userTokenBalanceIb}
              userTokenBalance={userTokenBalance}
            />
          )}
        </Box>
      </TabPanel>
      <ApyContainer>
        <Text fontSize="14px">{t('Deposit APY')}</Text>
        {apy ? <Text fontSize="14px">{apyCell(apy)}</Text> : <Skeleton width="80px" height="1rem" />}
      </ApyContainer>
      <Text color="#6F767E" fontSize="12px">
        {t(
          'Reminder: After receiving ibTokens from depositing in the lending pools, you can stake ibTokens for more yields.',
        )}
      </Text>
    </StyledPage>
  )
}

export default LendAction
