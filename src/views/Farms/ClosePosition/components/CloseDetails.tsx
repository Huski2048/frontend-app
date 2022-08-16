import {
  Box,
  Button,
  Flex,
  Text,
  useTooltip,
  AutoRenewIcon,
  useMatchBreakpoints,
} from 'husky-uikit'
import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useVault } from 'hooks/useContract'
import { useFarmTokensLpData, useFarmPancakeLpData, useFarmFromWorker } from 'state/leverage/hooks'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { TokenImage } from 'components/TokenImage'
import { useWeb3React } from '@web3-react/core'
import { useHistory } from 'react-router-dom'
import { TRADE_FEE, BIG_TEN } from 'config'
import { getAddress } from 'utils/addressHelpers'
import useTheme from 'hooks/useTheme'
import InfoItem from 'components/InfoItem'
import { getPriceImpact } from '../../helpers'

const GrayBox = styled(Box)`
  margin-top: 20px;
  border-radius: 12px;
  padding: 1rem;
  ${Text} {
    color: #6f767e;
    font-size: 10px;
    ${({ theme }) => theme.mediaQueries.xxl} {
      font-size: 12px;
    }
  }
`

const Section = styled(Flex)`
  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
  }
  > ${Flex}, > ${Box} {
    padding: 1rem 0;
  }
`

const BusdPriceContainer = styled(Flex)`
  align-items: center;
  > ${Flex} {
    padding: 0 5px;
    > ${Box} {
      width: 10px;
      ${({ theme }) => theme.mediaQueries.xxl} {
        width: 18px;
      }
      > svg {
        width: 100%;
      }
    }
  }
`
const Separator = styled(Box)`
  background-color: ${({ theme }) => theme.colors.text};
  width: 1px;
  margin: 0 5px;
  height: calc(10px * 1.5);
  ${({ theme }) => theme.mediaQueries.xxl} {
    height: calc(12px * 1.5);
  }
`

const SubText = styled(Text)`
  color: #6f767e;
  font-size: 10px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 12px;
  }
`

const ClosePosBtn = styled(Button)`
  font-size: 10px;
  padding: 3px 12px;
  border-radius: 8px;
  height: unset;
  line-height: 24px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    padding: 5px 12px;
    border-radius: 10px;
    font-size: 14px;
  }
`

const CloseDetails = ({ data, isConvertTo }) => {
  const { isDark } = useTheme()
  const { positionId, debtValue, lpAmount, worker } = data
  const farmData = useFarmFromWorker(worker)
  const {
    workerAddress,
    strategies,
    tokenPriceUsd,
    quoteTokenPriceUsd,
    token,
    quoteToken,
    pool,
    pid
  } = farmData

  const { t } = useTranslation()
  const { toastError, toastSuccess, toastInfo } = useToast()
  const tokenVaultAddress = getAddress(pool.address)
  const vaultContract = useVault(tokenVaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { totalSupply } = useFarmPancakeLpData(pid, pool.pid)
  const { tokenAmountTotal, quoteTokenAmountTotal } = useFarmTokensLpData(pid, pool.pid)
  const history = useHistory()

  const symbolName = token.symbol.replace('wBNB', 'BNB')
  const tokenValueSymbol = token.symbol.replace('wBNB', 'BNB')
  const quoteTokenValueSymbol = quoteToken.symbol.replace('wBNB', 'BNB')
  const baseTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(totalSupply)).times(lpAmount)
  const farmTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(totalSupply)).times(lpAmount)
  const basetokenBegin = parseInt(tokenAmountTotal)
  const farmingtokenBegin = parseInt(quoteTokenAmountTotal)

  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18)).toNumber()
  const convertedPositionValueAssets =
    Number(baseTokenAmount) +
    basetokenBegin -
    (farmingtokenBegin * basetokenBegin) / (Number(farmTokenAmount) * (1 - TRADE_FEE) + farmingtokenBegin)
  const convertedPositionValue = convertedPositionValueAssets - Number(debtValueNumber)

  let amountToTrade = 0
  let convertedBaseTokenValue
  let tokenReceive = 0
  if (Number(baseTokenAmount) < Number(debtValueNumber)) {
    amountToTrade =
      ((basetokenBegin * farmingtokenBegin) / (basetokenBegin - Number(debtValueNumber) + Number(baseTokenAmount)) -
        farmingtokenBegin) /
      (1 - TRADE_FEE)
  }
  const convertedFarmTokenValue = Number(farmTokenAmount) - amountToTrade
  if (Number(baseTokenAmount) >= Number(debtValueNumber)) {
    tokenReceive = Number(baseTokenAmount) - Number(debtValueNumber)
    convertedBaseTokenValue = baseTokenAmount
  } else {
    convertedBaseTokenValue = debtValueNumber
  }

  let strategy
  if (isConvertTo) {
    strategy = strategies.StrategyLiquidate
    amountToTrade = Number(farmTokenAmount)
  } else {
    strategy = strategies.StrategyWithdrawMinimizeTrading
  }

  const priceImpact = getPriceImpact(
    token,
    tokenAmountTotal,
    quoteTokenAmountTotal,
    amountToTrade,
    symbolName)
  const tradingFees = Number(amountToTrade) * TRADE_FEE

  const [isPending, setIsPending] = React.useState(false)
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
        vaultContract,
        'work',
        [id, address, amount, loan, maxReturn, dataWorker],
        symbolName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your position was closed successfully'))
        history.push('/farms')
      }
    } catch (error) {
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
    let minToken
    if (isConvertTo) {
      minToken = (Number(convertedPositionValue) * 0.995).toString()
    } else {
      minToken = (Number(convertedFarmTokenValue) * 0.995).toString()
    }
    const abiCoder = ethers.utils.defaultAbiCoder
    const dataStrategy = abiCoder.encode(['uint256'], [ethers.utils.parseEther(minToken)])
    const dataWorker = abiCoder.encode(['address', 'bytes'], [strategy, dataStrategy])

    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const {
    targetRef: positionValueRef,
    tooltip: positionValueTooltip,
    tooltipVisible: positionValueTooltipVisible,
  } = useTooltip(
    <>
      <Text>Total value of your farming position calculated from PancakeSwap pool’s reserve.</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: amountToTradeRef,
    tooltip: amountToTradeTooltip,
    tooltipVisible: amountToTradeTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('The amount that will be traded to BNB based on your selected method.')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: priceImpactRef,
    tooltip: priceImpactTooltip,
    tooltipVisible: priceImpactTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Impact to price due to trade size.')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: tradingFeesRef,
    tooltip: tradingFeesTooltip,
    tooltipVisible: tradingFeesTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('PancakeSwap trading fees')}</Text>
      <Text>{t('HUSKI trading fees')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: convertedPositionValueRef,
    tooltip: convertedPositionValueTooltip,
    tooltipVisible: convertedPositionValueTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Assets you will have after converting the required amount into BNB')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: debtValueRef,
    tooltip: debtValueTooltip,
    tooltipVisible: debtValueTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Debt Value = Borrowed Asset + Borrowing Interest')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: minimumReceivedRef,
    tooltip: minimumReceivedTooltip,
    tooltipVisible: minimumReceivedTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t('Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.')}
      </Text>
    </>,
    { placement: 'top-start' },
  )

  const { isXxl } = useMatchBreakpoints()

  return (
    <>
      {isConvertTo ? null : (
        <GrayBox background={isDark ? '#111315' : '#F7F7F8'}>
          <Text>
            {t(
              'We will convert the minimum required amount of tokens into %symbolName% to pay back the debt and return the remaining assets to you. This can potentially save on slippage and trading fees.',
              { symbolName },
            )}
          </Text>
        </GrayBox>
      )}
      <Section flexDirection="column" mt="40px">
        <Box>
          <InfoItem
            main={t('Amount to Trade')}
            value={Number.isNaN(Number(baseTokenAmount)) ? null
              : (new BigNumber(farmTokenAmount).lt(0.001) ? new BigNumber(farmTokenAmount).toFixed(6, 1) : new BigNumber(farmTokenAmount).toFixed(3, 1)
                + t(' ') + quoteTokenValueSymbol
                + t(' + ') + t(' ')
                + (new BigNumber(baseTokenAmount).lt(0.001) ? new BigNumber(baseTokenAmount).toFixed(6, 1) : new BigNumber(baseTokenAmount).toFixed(3, 1))
                + t(' ') + tokenValueSymbol)}
            tooltipVisible={positionValueTooltipVisible}
            tooltip={positionValueTooltip}
            targetRef={positionValueRef} />
          <BusdPriceContainer flexWrap="wrap">
            <Flex alignItems="center">
              <Box mr="5px" width={isXxl ? 18 : 10} height={isXxl ? 18 : 10}>
                <TokenImage
                  token={token}
                  width={isXxl ? 18 : 10}
                  height={isXxl ? 18 : 10}
                  style={{ maxWidth: 'unset !important' }}
                />
              </Box>
              <SubText>
                1&nbsp;{token?.symbol.replace('wBNB', 'BNB')}&nbsp;=&nbsp;
                {new BigNumber(tokenPriceUsd).toFixed(2, 1)}&nbsp;
                {quoteToken?.symbol.replace('wBNB', 'BNB')}
              </SubText>
            </Flex>
            <Separator />
            <Flex alignItems="center">
              <Box mr="5px" width={isXxl ? 18 : 10} height={isXxl ? 18 : 10}>
                <TokenImage
                  token={quoteToken}
                  width={isXxl ? 18 : 10}
                  height={isXxl ? 18 : 10}
                  style={{ maxWidth: 'unset !important' }}
                />
              </Box>
              <SubText>
                1&nbsp;{quoteToken?.symbol.replace('wBNB', 'BNB')}&nbsp;=&nbsp;
                {new BigNumber(quoteTokenPriceUsd).toFixed(2, 1)}&nbsp;
                {quoteToken?.symbol.replace('wBNB', 'BNB')}
              </SubText>
            </Flex>
          </BusdPriceContainer>
        </Box>

        <InfoItem
          main={t('Amount to Trade')}
          value={Number.isNaN(amountToTrade) ? null : amountToTrade.toPrecision(4) + t(' ') + quoteTokenValueSymbol}
          tooltipVisible={amountToTradeTooltipVisible}
          tooltip={amountToTradeTooltip}
          targetRef={amountToTradeRef} />

        <InfoItem
          main={t('Price Impact')}
          value={Number.isNaN(priceImpact) ? null : new BigNumber(priceImpact).toPrecision(3, 1) + t('%')}
          tooltipVisible={priceImpactTooltipVisible}
          tooltip={priceImpactTooltip}
          targetRef={priceImpactRef} />

        <InfoItem
          main={t('Trading Fees')}
          value={Number.isNaN(tradingFees) ? null : new BigNumber(tradingFees).toPrecision(3, 1) + t('%')}
          tooltipVisible={tradingFeesTooltipVisible}
          tooltip={tradingFeesTooltip}
          targetRef={tradingFeesRef} />

        <InfoItem
          main={t('Converted Position Value Assets')}
          value={Number.isNaN(convertedPositionValueAssets) ? null : (isConvertTo
            ? (convertedPositionValueAssets.toFixed(3) + t(' ') + tokenValueSymbol)
            : (new BigNumber(convertedFarmTokenValue).lt(0.001) ? new BigNumber(convertedFarmTokenValue).toFixed(6, 1) : new BigNumber(convertedFarmTokenValue).toFixed(3, 1)
              + t(' '))
            + quoteTokenValueSymbol
            + t(' + ')
            + (new BigNumber(convertedBaseTokenValue).lt(0.001) ? new BigNumber(convertedBaseTokenValue).toFixed(6, 1) : new BigNumber(convertedBaseTokenValue).toFixed(3, 1))
            + t(' ')
            + tokenValueSymbol)}
          tooltipVisible={convertedPositionValueTooltipVisible}
          tooltip={convertedPositionValueTooltip}
          targetRef={convertedPositionValueRef} />

        <InfoItem
          main={t('Debt Value')}
          value={Number.isNaN(debtValueNumber) ? null : debtValueNumber.toFixed(3) + t(' ') + tokenValueSymbol}
          tooltipVisible={debtValueTooltipVisible}
          tooltip={debtValueTooltip}
          targetRef={debtValueRef} />
      </Section>

      <Section flexDirection="column">
        <InfoItem
          main={t('You will receive approximately')}
          value={Number.isNaN(convertedPositionValue) ? null : (isConvertTo
            ? (Number(convertedPositionValue).toPrecision(4) + t(' ') + tokenValueSymbol)
            : (new BigNumber(convertedFarmTokenValue).lt(0.001) ? new BigNumber(convertedFarmTokenValue).toFixed(6, 1) : new BigNumber(convertedFarmTokenValue).toFixed(3, 1)
              + t(' '))
            + quoteTokenValueSymbol
            + t(' + ')
            + (new BigNumber(tokenReceive).lt(0.001) ? new BigNumber(tokenReceive).toFixed(6, 1) : new BigNumber(tokenReceive).toFixed(3, 1))
            + t(' ')
            + tokenValueSymbol)}
          tooltipVisible={null}
          tooltip={null}
          targetRef={null} />

        <InfoItem
          main={t('Minimum Received')}
          value={Number.isNaN(convertedPositionValue) ? null : (isConvertTo
            ? ((Number(convertedPositionValue) * 0.995).toPrecision(4) + t(' ') + tokenValueSymbol)
            : (new BigNumber(convertedFarmTokenValue).lt(0.001) ? new BigNumber(convertedFarmTokenValue).times(0.995).toFixed(6, 1) : new BigNumber(convertedFarmTokenValue).times(0.995).toFixed(3, 1)
              + t(' '))
            + quoteTokenValueSymbol
            + t(' + ')
            + (new BigNumber(tokenReceive).lt(0.001) ? new BigNumber(tokenReceive).toFixed(6, 1) : new BigNumber(tokenReceive).toFixed(3, 1))
            + t(' ')
            + tokenValueSymbol)}
          tooltipVisible={minimumReceivedTooltipVisible}
          tooltip={minimumReceivedTooltip}
          targetRef={minimumReceivedRef} />

        <Flex justifyContent="center">
          <ClosePosBtn
            onClick={handleConfirm}
            disabled={!account || isPending}
            isLoading={isPending}
            endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
          >
            {isPending ? t('Closing Position') : t('Close Position')}
          </ClosePosBtn>
        </Flex>
      </Section>
    </>
  )
}

export default CloseDetails
