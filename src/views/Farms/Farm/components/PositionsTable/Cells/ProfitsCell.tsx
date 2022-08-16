import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'config/index'
import {
  Text,
  useMatchBreakpoints,
  Skeleton,
  Flex,
  useTooltip,
  Box,
  ArrowForwardIcon,
} from 'husky-uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { HuskiProfit1, HuskiProfit2, HuskiProfit3 } from 'assets'
import { BigText } from 'components/Text/Text'
import { useFarmTokensLpData, useFarmPancakeLpData, useFarmFromWorker } from 'state/leverage/hooks'
import { getProfitOrLossLeft, getProfitOrLossRight } from '../../../../helpers'
import BaseCell, { CellContent } from './BaseCell'

interface Props {
  data: Record<string, any>
}

export const SProfitsCell = styled(BaseCell)`
  flex: 1 0 100px;
  ${({ theme }) => theme.screen.tablet} {
    display: none;
  }
`
const ValueText = styled(Text)`
  font-size: 12px;
  font-weight: 700;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 14px;
  }
`
const TooltipContainer = styled(Box)`
  ${Text} {
    font-size: 10px;
    color: ${({ theme }) =>
      theme.isDark
        ? '#F4EEFF'
        : '#2E2D2E'}; // this exists to bypass something from the uikit // remove later after making changes to uikit
    svg {
      width: 10px;
      fill: #f4eeff;
    }
    ${({ theme }) => theme.mediaQueries.xxl} {
      font-size: 12px;
      svg {
        width: 12px;
      }
    }
  }
  > ${Box} {
    > ${Flex} {
      padding: 5px 0;
      ${Text} {
        &:first-child {
          flex: 1 0 auto;
        }
        &:last-child {
          ${({ theme }) => theme.mediaQueries.md} {
            text-align: right;
          }
        }
      }
    }
  }
`

const ProfitsCell: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { worker } = data
  const farmData = useFarmFromWorker(worker)
  const {
    tokenPriceUsd,
    quoteTokenPriceUsd,
    token,
    quoteToken,
    pool,
    pid
  } = farmData
  const { totalSupply } = useFarmPancakeLpData(pid, pool.pid)
  const { tokenAmountTotal, quoteTokenAmountTotal } = useFarmTokensLpData(pid, pool.pid)
  const {
    lpAmountLeft,
    baseTokenAmountLeft,
    farmTokenAmountLeft,
    totalPositionValueLeft,
    debtValueLeft,
    equityValueTokenLeft,
    equityValueUsdLeft,
    entryBasePrice,
    entryFarmPrice,
  } = getProfitOrLossLeft(
    pool,
    totalSupply,
    tokenAmountTotal, quoteTokenAmountTotal, data)

  const {
    lpAmountRight,
    baseTokenAmountRight,
    farmTokenAmountRight,
    totalPositionValueRight,
    debtValueRight,
    equityValueTokenRight,
    equityValueUsdRight,
    currentBasePrice,
    currentFarmPrice,
    baseToken,
    farmToken,
  } = getProfitOrLossRight(
    quoteTokenPriceUsd, tokenPriceUsd, token, quoteToken, pool,
    totalSupply, tokenAmountTotal, quoteTokenAmountTotal, data)

  const getValueDiff = (base: BigNumber, current: BigNumber): React.ReactNode => {
    const valueDiff = current.minus(base) || BIG_ZERO
    if (valueDiff.isNaN()) {
      return <Skeleton width="80px" height="1.5rem" />
    }
    if (valueDiff.isZero()) {
      return <Text as="span">({valueDiff.toString()})</Text>
    }
    return (
      <Text as="span" color={valueDiff.isNegative() ? '#FF6A55 !important' : '#83BF6E !important'}>
        ({valueDiff.isNegative() ? '-' : '+'}
        {valueDiff.abs().toFormat(2, 1)})
      </Text>
    )
  }
  const getPercentageDiff = (base: BigNumber, current: BigNumber): React.ReactNode => {
    // percentage differnce between both values
    const percentageDiff = current.minus(base).dividedBy(base) || BIG_ZERO
    if (percentageDiff.isNaN()) {
      return <Skeleton width="80px" height="1.5rem" />
    }

    if (percentageDiff.isZero()) {
      return <Text as="span">({percentageDiff.toString()}%)</Text>
    }
    return (
      <Text as="span" color={percentageDiff.isNegative() ? '#FF6A55 !important' : '#83BF6E !important'}>
        ({percentageDiff.isNegative() ? '-' : '+'}
        {percentageDiff.abs().times(100).toFormat(2, 1)}%)
      </Text>
    )
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <TooltipContainer width="100%" maxWidth="768px">
      <Box>
        <Text bold style={{ textDecoration: 'underline' }} mb="10px">
          {t('Position Value')}
        </Text>
        <Flex
          justifyContent="space-between"
          flexDirection={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'initial' : 'center'}
        >
          <Text bold>{t('LP Amount:')}</Text>
          <Text>
            {new BigNumber(lpAmountLeft).toFixed(2, 1)} <ArrowForwardIcon />{' '}
            {new BigNumber(lpAmountRight).toFixed(2, 1)}{' '}
            {getPercentageDiff(new BigNumber(lpAmountLeft), new BigNumber(lpAmountRight))}
          </Text>
        </Flex>
        <Flex
          justifyContent="space-between"
          flexDirection={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'initial' : 'center'}
        >
          <Text bold>{t('Position Assets:')}</Text>
          <Text>
            {new BigNumber(farmTokenAmountLeft).toFixed(2, 1)} {farmToken} +{' '}
            {new BigNumber(baseTokenAmountLeft).toFixed(2, 1)} {baseToken}
            <ArrowForwardIcon />
            {new BigNumber(farmTokenAmountRight).toFixed(2, 1)}{' '}
            {getValueDiff(new BigNumber(farmTokenAmountLeft), new BigNumber(farmTokenAmountRight))} {farmToken}+{' '}
            {new BigNumber(baseTokenAmountRight).toFixed(2, 1)}{' '}
            {getValueDiff(new BigNumber(baseTokenAmountLeft), new BigNumber(baseTokenAmountRight))} {baseToken}
          </Text>
        </Flex>
        <Flex
          justifyContent="space-between"
          flexDirection={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'initial' : 'center'}
        >
          <Text bold>{t('Total Position Value (USD):')}</Text>
          <Text>
            ${new BigNumber(totalPositionValueLeft).toFixed(2, 1)} <ArrowForwardIcon /> $
            {new BigNumber(totalPositionValueRight).toFixed(2, 1)}&nbsp;
            {getPercentageDiff(new BigNumber(totalPositionValueLeft), new BigNumber(totalPositionValueRight))}
          </Text>
        </Flex>
        <Flex
          justifyContent="space-between"
          flexDirection={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'initial' : 'center'}
        >
          <Text bold>{t('Debt Value (%token%):', { token: baseToken })}</Text>
          <Text>
            {new BigNumber(debtValueLeft).toFixed(2, 1)} <ArrowForwardIcon />{' '}
            {new BigNumber(debtValueRight).toFixed(2, 1)}{' '}
            {getPercentageDiff(new BigNumber(debtValueLeft), new BigNumber(debtValueRight))}
          </Text>
        </Flex>
        <Flex
          justifyContent="space-between"
          flexDirection={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'initial' : 'center'}
        >
          <Text bold>{t('Equity Value (%token%):', { token: baseToken })}</Text>
          <Text>
            {new BigNumber(equityValueTokenLeft).toFixed(2, 1)} <ArrowForwardIcon />{' '}
            {new BigNumber(equityValueTokenRight).toFixed(2, 1)}{' '}
            {getPercentageDiff(new BigNumber(equityValueTokenLeft), new BigNumber(equityValueTokenRight))}
          </Text>
        </Flex>
        <Flex
          justifyContent="space-between"
          flexDirection={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'initial' : 'center'}
        >
          <Text bold>{t('Equity Value (USD):')}</Text>
          <Text>
            ${new BigNumber(equityValueUsdLeft).toFixed(2, 1)} <ArrowForwardIcon /> $
            {new BigNumber(equityValueUsdRight).toFixed(2, 1)}{' '}
            {getPercentageDiff(new BigNumber(equityValueUsdLeft), new BigNumber(equityValueUsdRight))}
          </Text>
        </Flex>
      </Box>
      <Box>
        <Text bold style={{ textDecoration: 'underline' }} mb="10px">
          {t('Prices')}
        </Text>
        <Flex
          justifyContent="space-between"
          flexDirection={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'initial' : 'center'}
        >
          <Text bold>{t('Entry Prices:')}</Text>
          <Text>
            {farmToken} ${entryFarmPrice} | {baseToken} ${entryBasePrice}
          </Text>
        </Flex>
        <Flex
          justifyContent="space-between"
          flexDirection={isMobile ? 'column' : 'row'}
          alignItems={isMobile ? 'initial' : 'center'}
        >
          <Text bold>{t('Current Prices:')}</Text>
          <Text>
            {farmToken} ${currentFarmPrice} | {baseToken} ${currentBasePrice}
          </Text>
        </Flex>
      </Box>
      {/* <Box>
        <Text style={{ textDecoration: 'underline' }} mb="10px">
          {t('Duration')}
        </Text>
        <Flex justifyContent="space-between" alignItems="center">
          <Text>{t('Position Opened on:')}</Text>
          <Text>{null}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Farm Duration:')}</Text>
          <Text>{null}</Text>
        </Flex>
      </Box> */}
      <Box>
        <Text bold style={{ textDecoration: 'underline' }} mb="10px">
          {t('Notes')}
        </Text>
        <Text as="ul">
          <Text as="li">{t('HUSKI rewards are not included in the Profit/Loss calculation.')}</Text>
          <Text as="li">
            {t('The Profit/Loss feature might not be available when the BSC Archive Node is unstable.')}
          </Text>
          <Text as="li">{t('This feature is currently in BETA.')}</Text>
        </Text>
      </Box>
    </TooltipContainer>,
    { placement: 'auto' },
  )

  const getImage = (): React.ReactNode => {
    if (profitLossValue.gt(BIG_ZERO)) {
      return (
        <Box border="1px solid #1A1D1F" borderRadius="100%" background="#ffffff" p="2px">
          <img src={HuskiProfit2} alt="" width="24px" height="24px" />
        </Box>
      )
    }
    if (profitLossValue.lt(BIG_ZERO)) {
      return (
        <Box border="1px solid #1A1D1F" borderRadius="100%" background="#ffffff" p="2px">
          <img src={HuskiProfit3} alt="" width="24px" height="24px" />
        </Box>
      )
    }
    return (
      <Box border="1px solid #1A1D1F" borderRadius="100%" background="#ffffff" p="2px">
        <img src={HuskiProfit1} alt="" width="24px" height="24px" />
      </Box>
    )
  }

  const profitLossValue = new BigNumber(equityValueUsdRight).minus(equityValueUsdLeft).dividedBy(equityValueUsdLeft)

  const getValueString = (): { color: string; value: string } => {
    if (profitLossValue.gt(BIG_ZERO)) {
      return { value: `+${profitLossValue.times(100).toFixed(2)}%`, color: '#83BF6E' }
    }
    if (profitLossValue.lt(BIG_ZERO)) {
      return { value: `-${profitLossValue.times(100).toFixed(2)}%`, color: '#FF6A55' }
    }
    return { value: profitLossValue.toFixed(2), color: 'text' }
  }

  return (
    <SProfitsCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <BigText textAlign="left">{t('Profit/Loss')}</BigText>
          </Flex>
        )}
        {profitLossValue && !profitLossValue.isNaN() ? (
          <Flex alignItems="center" flexDirection="column" style={{ gap: '5px' }}>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>{getImage()}</span>
            <ValueText color={getValueString().color}>{getValueString().value}</ValueText>
          </Flex>
        ) : (
          <Skeleton width="80px" height="1.5rem" />
        )}
      </CellContent>
    </SProfitsCell>
  )
}

export default ProfitsCell
