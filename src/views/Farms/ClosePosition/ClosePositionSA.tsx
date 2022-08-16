import React, { useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import {
  Box,
  Flex,
  Text,
  Skeleton,
  Button,
  AutoRenewIcon,
  useMatchBreakpoints,
  ChevronLeftIcon,
} from 'husky-uikit'
import useToast from 'hooks/useToast'
import { useVault } from 'hooks/useContract'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import BigNumber from 'bignumber.js'
import { TRADE_FEE, BIG_TEN } from 'config'
import { ethers } from 'ethers'
import { TokenPairImage } from 'components/TokenImage'
import { ArrowDownIcon, Paw } from 'assets'
import { useWeb3React } from '@web3-react/core'
import { getBalanceAmount } from 'utils/formatBalance'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import { useFarmTokensLpData, useFarmPancakeLpData } from 'state/leverage/hooks'

interface LocationParams {
  data: any
}

const Bubble = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  padding: 20px;
  border-radius: ${({ theme }) => theme.radii.default};
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
`

const Container = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  padding: 30px 20px 25px;
  margin-bottom: 20px !important;
`
const StyledArrowDown = styled(ArrowDownIcon)`
  fill: none;
`
const AmountPanel = styled(Box)`
  background: ${({ theme }) => (theme.isDark ? '#111315' : '#F7F7F8')};
  box-sizing: border-box;
  border-radius: 12px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  ${Text} {
    color: ${({ theme }) => (theme.isDark ? '#ffffff' : '#1a1d1f')};
  }
`
const StyledPage = styled(Page)`
  align-items: center;
  justify-content: center;
  * {
    font-family: 'GenJyuuGothic';
  }
`
const TitleText = styled(Text)`
  font-size: 13px;
  font-weight: 700;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 20px;
  }
`
const MainText = styled(Text)`
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 14px;
  }
`
const SubText = styled(Text) <{ bolder?: boolean }>`
  font-size: 10px;
  font-weight: ${({ bolder }) => (bolder ? '500' : '400')};
  color: ${({ theme, bolder }) => (bolder ? theme.colors.text : theme.colors.textSubtle)};
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 12px;
  }
`
const ValueText = styled(Text)`
  font-size: 16px;
  font-weight: 700;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 24px;
  }
`
const ClosePosBtn = styled(Button)`
  font-size: 10px;
  padding: 3px 12px;
  border-radius: 8px;
  height: unset;
  line-height: 24px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 14px;
  }
`

const ClosePositionSA = () => {
  const { t } = useTranslation()
  const history = useHistory()
  // const { isDark } = useTheme()
  const { isMobile } = useMatchBreakpoints()
  const {
    state: { data },
  } = useLocation<LocationParams>()

  const { positionId, debtValue, lpAmount } = data
  const {
    lpSymbol,
    token,
    quoteToken,
    pid,
    pool,
    strategies,
    workerAddress,
  } = data.farmData
  const { vaultAddress } = pool.address

  const { balance: tokenBalance } = useTokenBalance(getAddress(token.address))
  const { balance: bnbBalance } = useGetBnbBalance()
  const userTokenBalanceIb = getBalanceAmount(useTokenBalance(data.farmData?.vaultAddress).balance).toJSON()
  // console.log(userTokenBalanceIb);

  const userTokenBalance = getBalanceAmount(
    token.symbol.toLowerCase() === 'bnb' ? bnbBalance : tokenBalance,
  ).toJSON()

  // console.log(data);

  const { toastError, toastSuccess, toastInfo } = useToast()
  const tokenVaultAddress = vaultAddress
  // const quoteTokenVaultAddress = QuoteTokenInfo?.vaultAddress
  const vaultContract = useVault(tokenVaultAddress)
  // const quoteTokenVaultContract = useVault(quoteTokenVaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { totalSupply } = useFarmPancakeLpData(pid, pool.pid)
  const { tokenAmountTotal, quoteTokenAmountTotal } = useFarmTokensLpData(pid, pool.pid)

  // let symbolName
  // let tokenValue
  // let quoteTokenValue
  // let tokenPrice
  // let quoteTokenPrice
  // let tokenValueSymbol
  // let quoteTokenValueSymbol
  // let baseTokenAmount
  // let farmTokenAmount
  // let basetokenBegin
  // let farmingtokenBegin
  // let workerAddress
  // let withdrawMinimizeTradingAddress
  // let contract
  // let lpSymbolName

  // if (vault.toUpperCase() === vaultAddress.toUpperCase()) {
  const symbolName = token?.symbol.toUpperCase().replace('WBNB', 'BNB')
  const tokenValue = token
  const quoteTokenValue = quoteToken
  const tokenValueSymbol = token?.symbol.toUpperCase().replace('WBNB', 'BNB')
  const quoteTokenValueSymbol = quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')
  const baseTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(totalSupply)).times(lpAmount)
  const farmTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(totalSupply)).times(lpAmount)
  const basetokenBegin = parseInt(tokenAmountTotal)
  const farmingtokenBegin = parseInt(quoteTokenAmountTotal)
  // workerAddress = address
  const withdrawMinimizeTradingAddress = strategies.StrategyLiquidate
  const contract = vaultContract
  const lpSymbolName = lpSymbol
  // } else {
  // symbolName = quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')
  // tokenValue = quoteToken
  // quoteTokenValue = token
  // tokenPrice = quoteTokenPriceUsd
  // quoteTokenPrice = tokenPriceUsd
  // tokenValueSymbol = quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')
  // quoteTokenValueSymbol = token?.symbol.toUpperCase().replace('WBNB', 'BNB')
  // baseTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
  // farmTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
  // basetokenBegin = parseInt(quoteTokenAmountTotal)
  // farmingtokenBegin = parseInt(tokenAmountTotal)
  // workerAddress = QuoteTokenInfo.address
  // withdrawMinimizeTradingAddress = QuoteTokenInfo.strategies.StrategyLiquidate
  // contract = quoteTokenVaultContract
  // lpSymbolName = QuoteTokenInfo?.name
  // }

  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18)).toNumber()
  const convertedPositionValueAssets =
    Number(baseTokenAmount) +
    basetokenBegin -
    (farmingtokenBegin * basetokenBegin) / (Number(farmTokenAmount) * (1 - TRADE_FEE) + farmingtokenBegin)
  const convertedPositionValue = convertedPositionValueAssets - Number(debtValueNumber)

  const [isPending, setIsPending] = useState<boolean>(false)
  const { account } = useWeb3React()

  const handleFarm = async (id, address, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    const callOptionsBNB = {
      gasLimit: 3800000,
      value: amount,
    }
    setIsPending(true)
    try {
      toastInfo(t('Closing Position...'), t('Please Wait!'))
      const tx = await callWithGasPrice(
        contract,
        'work',
        [id, address, amount, loan, maxReturn, dataWorker],
        symbolName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your position was closed successfully'))
        history.push(`/singleAssets`)
      }
    } catch (error) {
      console.error('error', error)
      toastError(t('Unsuccessful'), t('Something went wrong your request. Please try again...'))
    } finally {
      setIsPending(false)
    }
  }

  const handleConfirm = async () => {
    const id = positionId
    const amount = 0
    const loan = 0
    const maxReturn = ethers.constants.MaxUint256
    const minfarmtoken = (Number(convertedPositionValue) * 0.995).toString()
    const abiCoder = ethers.utils.defaultAbiCoder

    const dataStrategy = abiCoder.encode(['uint256'], [ethers.utils.parseEther(minfarmtoken)])
    const dataWorker = abiCoder.encode(['address', 'bytes'], [withdrawMinimizeTradingAddress, dataStrategy])
    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  return (
    <StyledPage>
      <Paw width="24px" height="24px" />
      <TitleText mx="auto" mt="15px">
        {t('Close Position')}
      </TitleText>
      <Container>
        <Flex justifyContent="space-between" alignItems="center">
          <MainText>{t('Position Value')}</MainText>
          <SubText>
            {t('Balance')}:{' '}
            <SubText as="span" bolder>
              {`${formatDisplayedBalance(
                userTokenBalance,
                token?.decimalsDigits,
              )} ${token?.symbol.replace('wBNB', 'BNB')}`}
            </SubText>
          </SubText>
        </Flex>
        <AmountPanel mt="10px" mb="50px">
          {baseTokenAmount ? (
            <ValueText>
              {new BigNumber(farmTokenAmount).toFixed(2, 1)}&nbsp;{quoteTokenValueSymbol} +{' '}
              {new BigNumber(baseTokenAmount).toFixed(2, 1)}&nbsp;{tokenValueSymbol}
            </ValueText>
          ) : (
            <Skeleton height="16px" width="80px" />
          )}
        </AmountPanel>
        <Flex flexDirection="column">
          <StyledArrowDown m="0 auto 30px" width="24px" />
          <Flex alignItems="center" justifyContent="space-between">
            <MainText>{t('Receive (Estimated)')}</MainText>
            <Flex flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? null : 'flex-end'}>
              <SubText>
                {t('Balance')}:{' '}
                <SubText as="span" bolder>
                  {`${formatDisplayedBalance(
                    userTokenBalanceIb,
                    token?.decimalsDigits,
                  )} i${token?.symbol.replace('wBNB', 'BNB')}`}
                </SubText>
              </SubText>
            </Flex>
          </Flex>
          <AmountPanel mt="10px">
            {convertedPositionValue ? (
              <ValueText>
                {convertedPositionValue.toFixed(3)} {tokenValueSymbol}
              </ValueText>
            ) : (
              <Skeleton height="16px" width="80px" />
            )}
          </AmountPanel>
        </Flex>
        <Flex justifyContent="space-between" mt="35px">
          <Flex style={{ cursor: 'pointer' }} alignItems="center">
            <ChevronLeftIcon color="#6F767E " width="18px" height="18px" />
            <Text color="#6F767E " fontSize="14px" onClick={() => history.goBack()}>
              {t('Back')}
            </Text>
          </Flex>
          <ClosePosBtn
            onClick={handleConfirm}
            disabled={!account || isPending}
            isLoading={isPending}
            endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
          >
            {isPending ? t('Closing Position') : t('Close Position')}
          </ClosePosBtn>
        </Flex>
      </Container>
      <Bubble justifyContent="space-between" alignItems="center">
        <Flex alignItems={isMobile ? 'flex-start' : 'center'} flexDirection={isMobile ? 'column' : 'row'}>
          <MainText fontWeight={700}>
            {symbolName}{' '}
            <MainText as="span" color="textSubtle">
              #{positionId}
            </MainText>
          </MainText>
        </Flex>
        <Flex alignItems="center">
          <Box width={24} height={24}>
            <TokenPairImage primaryToken={tokenValue} secondaryToken={quoteTokenValue} width={24} height={24} />
          </Box>
          <Box ml="5px">
            <MainText>{lpSymbolName.toUpperCase().replace('WBNB', 'BNB')}</MainText>
            <SubText>{data?.farmData?.lpExchange}</SubText>
          </Box>
        </Flex>
      </Bubble>
    </StyledPage>
  )
}

export default ClosePositionSA
