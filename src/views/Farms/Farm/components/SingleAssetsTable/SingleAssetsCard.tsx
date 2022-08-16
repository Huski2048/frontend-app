/* eslint-disable no-restricted-properties */
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import {
  CardBody as UiKitCardBody,
  Flex,
  Text,
  Skeleton,
  Button,
  Box,
  Grid,
  ChevronDownIcon,
  useWalletModal,
  useTooltip,
} from 'husky-uikit'
import styled from 'styled-components'
import { BigText, SmText } from 'components/Text/Text'
import { TokenPairImage } from 'components/TokenImage'
import { useTranslation } from 'contexts/Localization'
import useAuth from 'hooks/useAuth'
import * as echarts from 'echarts'
import ReactEcharts from 'echarts-for-react'
import { useCakePrice, useFarmMasterChefData, useFarmTokensLpData, useFarmPancakeLpData, useHuskiPrice } from 'state/leverage/hooks'
import { usePoolVaultData, usePoolFairLaunchData } from 'state/pool/hooks'
import { usePriceList } from 'utils/api'
import useTheme from 'hooks/useTheme'
import nFormatter from 'utils/nFormatter'
import BigNumber from 'bignumber.js'
import { useTradeFeesFromPid, useTradeFees7Days } from '../../../../../state/graph/hooks'
import { getHuskyRewards, getYieldFarming, getTvl, getSingle7Days, getApr, getApy, getDisplayApr } from '../../../helpers'
import { Card } from './Card'
import CardHeader from './CardHeader'

interface Props {
  data: any
  strategyFilter: string
}

const SBigText = styled(Text)`
  color: ${({ theme }) => theme.color.tableText};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  ${({ theme }) => theme.screen.tablet} {
    font-size: 12px;
  }
`
const SOptionTitleText = styled(Text)`
  font-size: 14px;
  line-height: 24px;
  font-weight: 600;
  ${({ theme }) => theme.screen.tablet} {
    font-size: 12px;
  }
`
const SOptionTitleText2 = styled(Text)`
  font-size: 12px;
  color: #6f767e;
  ${({ theme }) => theme.screen.tablet} {
    font-size: 10px;
  }
`
const SNumberText1 = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  ${({ theme }) => theme.screen.tablet} {
    font-size: 16px;
  }
`
const SNumberText2 = styled(Text)`
  font-size: 12px;
  color: #83bf6e;
  ${({ theme }) => theme.screen.tablet} {
    font-size: 9px;
  }
`

const CardBody = styled(UiKitCardBody)`
  .avgContainer {
    border-bottom: 1px solid ${({ theme }) => `${theme.colors.textSubtle}26`};
    padding-bottom: 0.5rem;
  }
`

const DropDown = styled.div<{ isselect: boolean }>`
  border-radius: 10px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
  z-index: 1;
  width: 64%;
  position: absolute;
  left: 37%;
  top: 65px;
  max-height: ${({ isselect }) => {
    if (isselect) {
      return '330px'
    }
    return '0px'
  }};
  overflow-y: ${({ isselect }) => {
    if (isselect) {
      return 'scroll'
    }
    return 'hidden'
  }};
  transition: max-height 0.3s;
  ::-webkit-scrollbar {
    display: none;
  }
`

const DropDownItem = styled(Flex)`
  :hover {
    background: lightgrey;
  }
`

const StrategyIcon = styled.div<{ market: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
  background: ${({ market }) => {
    if (market.toLowerCase() === 'bear') {
      return '#FE6057'
    }
    if (market.toLowerCase() === 'bull') {
      return '#27C73F'
    }
    if (market.toLowerCase() === 'neutral') {
      return '#FCBD2C'
    }
    return null
  }};
`
const SingleAssetsCard: React.FC<Props> = ({ data, strategyFilter }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const [singleData, setSingleData] = useState<any>(data?.singleArray[0])
  const { isDark } = useTheme()
  const { tradingFees7Days } = useTradeFees7Days(singleData.pid)
  const {
    tokenPriceUsd,
    quoteTokenPriceUsd,
    pool,
    pid
  } = singleData

  const { vaultDebtVal, interestRatePerYear } = usePoolVaultData(pool.pid)
  const { debtPoolRewardPerBlock } = usePoolFairLaunchData(pool.pid)
  const { totalSupply } = useFarmPancakeLpData(pid, pool.pid)
  const { tokenAmountTotal, quoteTokenAmountTotal, lpTotalInQuoteToken } = useFarmTokensLpData(pid, pool.pid)
  const { poolWeight, workerInfo } = useFarmMasterChefData(pid, pool.pid)

  let primaryTokenImage
  let secondaryTokenImage
  let tokenSymbol
  let quoteTokenSymbol

  if (singleData?.quoteToken?.symbol === 'CAKE' && singleData?.singleFlag === 0) {
    primaryTokenImage = singleData?.quoteToken
    secondaryTokenImage = singleData?.token
    tokenSymbol = singleData?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')
    quoteTokenSymbol = singleData?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')
  } else {
    primaryTokenImage = singleData?.token
    secondaryTokenImage = singleData?.quoteToken
    tokenSymbol = singleData?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')
    quoteTokenSymbol = singleData?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')
  }

  const { totalTvl } = getTvl(
    tokenPriceUsd,
    quoteTokenPriceUsd,
    totalSupply,
    tokenAmountTotal,
    quoteTokenAmountTotal,
    workerInfo)
  const huskyRewards = getHuskyRewards(
    vaultDebtVal,
    debtPoolRewardPerBlock,
    tokenPriceUsd,
    huskyPrice)
  const yieldFarmData = getYieldFarming(
    quoteTokenPriceUsd,
    poolWeight,
    lpTotalInQuoteToken, new BigNumber(cakePrice))
  // const { borrowingInterest } = useFarmsWithToken(singleData, borrowingAsset)
  // const { interestRatePerYear } = usePoolVaultData(data?.farmData.pool.pid)
  const { tradingFee: tradeFee } = useTradeFeesFromPid(singleData.pid)
  // const tradeFee = tradingFees7Days[0]
  // const { tradingFees: trade } = useTradingFees(singleData)
  const dropdown = useRef(null)

  const getDailyEarnings = (lvg) => {
    const apr = getApr(yieldFarmData, tradeFee, huskyRewards, interestRatePerYear, lvg)
    const dailyEarnings = ((apr / 365) * parseFloat(quoteTokenAmountTotal)) / parseFloat(tokenAmountTotal)
    return dailyEarnings
  }

  const { priceList: cakePriceList, dateList } = usePriceList('pancakeswap-token')
  const { singleApyList, singleDateList } = getSingle7Days(quoteTokenPriceUsd, poolWeight, lpTotalInQuoteToken, cakePriceList, tradingFees7Days, dateList)

  const strategies = React.useMemo(
    () => [
      {
        value: 'bull2x',
        name: 'Bull Strategy 2x',
        singleLeverage: 2,
        direction: 'long',
        riskLevel: 'Moderate',
      },
      {
        value: 'bull3x',
        name: 'Bull Strategy 3x',
        singleLeverage: 3,
        direction: 'long',
        riskLevel: 'High',
      },
      {
        value: 'neutral',
        name: 'Neutral Strategy 2x',
        singleLeverage: 2,
        direction: 'short',
        riskLevel: 'Low',
      },
      {
        value: 'bear',
        name: 'Bear Strategy 3x',
        singleLeverage: 3,
        direction: 'short',
        riskLevel: 'High',
      },
    ],
    [],
  )

  const getStrategyInfo = (strategy: string) => {
    const currStrat = strategies.find((s) => s.value === strategy)
    return {
      name: currStrat?.name,
      singleLeverage: currStrat?.singleLeverage,
      direction: currStrat?.direction,
      riskLevel: currStrat?.riskLevel,
    }
  }

  const [selectedStrategy, setSelectedStrategy] = useState(
    singleData?.token?.symbol.toUpperCase() === 'HUSKI' ? 'neutral' : 'bull2x',
  )

  const getSelectOptions = React.useCallback(() => {
    const selOptions = []
    data.singleArray.forEach((single) => {
      strategies.forEach((strat) => {
        const lpSymbolName = single?.lpSymbol.toUpperCase().replace('WBNB', 'BNB')
        if (single?.quoteToken?.symbol === 'CAKE' && single?.singleFlag === 0) {
          if (strat.value.includes('bull')) {
            selOptions.push({
              label: `${strat.name} + ${lpSymbolName}`,
              value: strat.value,
            })
          }
        } else {
          selOptions.push({
            label: `${strat.name} + ${lpSymbolName}`,
            // label: `${strat.name} + ${single?.lpSymbol}`,
            value: strat.value,
          })
        }
      })
    })

    return selOptions
  }, [strategies, data])

  useEffect(() => {
    setSelectedStrategy((prevState) => strategyFilter || prevState)
  }, [strategyFilter])

  const { singleLeverage, riskLevel, name: strategyName } = getStrategyInfo(selectedStrategy)

  const tvl = totalTvl.toNumber()
  const apy = getDisplayApr(getApy(yieldFarmData, tradeFee, huskyRewards, interestRatePerYear, singleLeverage))
  const apyOne = getDisplayApr(getApy(yieldFarmData, tradeFee, huskyRewards, interestRatePerYear, 1))
  const dailyEarnings = getDailyEarnings(singleLeverage)

  const avgApy = (Number(apy) - Number(apyOne)).toFixed(2)

  const getOption = () => {
    const option = {
      tooltip: {
        formatter: (params) => {
          return `${params[0]?.name}<br />
          ${params[0]?.data}%`
        },
        trigger: 'axis',
      },
      xAxis: {
        data: singleDateList,
        boundaryGap: false,
        show: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        show: false,
        splitLine: {
          show: false,
        },
      },
      color: [color],
      series: [
        {
          symbol: 'none',
          type: 'line',
          data: singleApyList,

          smooth: 0.3,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                // eslint-disable-next-line object-shorthand
                color: color,
              },
              {
                offset: 1,
                color: '#FFFFFF',
              },
            ]),
          },
        },
      ],
      grid: {
        left: 0,
        top: 20,
        right: 0,
        bottom: 10,
      },
    }
    return option
  }

  const color = (() => {
    if (selectedStrategy.includes('bull')) {
      return '#27C73F'
    }
    if (selectedStrategy.includes('bear')) {
      return '#FE6057'
    }
    return '#FCBD2C'
  })()

  // let soption
  getSelectOptions().map(() => {
    // if (d.value === selectedStrategy) soption = d.label.split(' +')[0]
    return ''
  })

  // const [selectedoption, setSelectedOption] = useState(soption)
  const handleSelectChange = (option) => {
    const lpSymbol = option.label.split('+ ').pop()
    setSingleData(data.singleArray.find((single) => single?.QuoteTokenInfo?.name === lpSymbol))
    setSelectedStrategy(option.value)
    // setSelectedOption(option.label.split(' +')[0])
  }

  const [isselect, setIsSelect] = useState(false)

  useEffect(() => {
    document.addEventListener('mousedown', (event) => {
      if (dropdown.current && isselect && !dropdown.current.contains(event.target)) {
        setIsSelect(false)
      }
    })
  }, [isselect])

  let prevpair

  // because of useState for setting which token pair and strategy is being used,
  // the data inside the card gets stale (doesn't update) this forces it to update
  // if theres not apy data,
  useEffect(() => {
    if (!apy) {
      setSingleData((prev) => data?.singleArray.find((item) => item?.pid === prev?.pid))
    }
  }, [data, apy])

  const { login, logout } = useAuth()
  const hasProvider: boolean = !!window.ethereum || !!window.BinanceChain
  const { onPresentConnectModal } = useWalletModal(login, logout, hasProvider)

  // const selectedTokenShouldDisable = ((): boolean => {
  //   if (selectedStrategy.includes('bull')) {
  //     return singleData?.isStableQuoteToken
  //   }
  //   return singleData?.isStableToken
  // })()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<Text>{t('Disabled')}</Text>, { placement: 'top-start' })

  return (
    <Card>
      <CardHeader data={singleData} />
      <CardBody>
        <Box className="avgContainer">
          <Flex alignItems="center" flexDirection="column">
            <Box style={{ position: 'relative', width: '100%' }} ref={dropdown}>
              <Flex
                onClick={() => setIsSelect(!isselect)}
                style={{ cursor: 'pointer' }}
                background={`${color}1A`}
                height="60px"
                border={`1px solid  ${color}`}
                borderRadius="10px"
                justifyContent="space-between"
              >
                <Flex alignItems="center" width="calc(100%)">
                  <TokenPairImage
                    primaryToken={secondaryTokenImage}
                    secondaryToken={primaryTokenImage}
                    width={34}
                    height={34}
                    primaryImageProps={{ style: { marginLeft: '10px' } }}
                    ml="20px"
                  />
                  <Flex flexDirection="column" marginLeft="30px">
                    <SOptionTitleText>{strategyName}</SOptionTitleText>
                    <SOptionTitleText2>
                      {`${singleData?.lpSymbol.toUpperCase().replace('WBNB', 'BNB')} ${singleData?.lpExchange
                        }`}
                    </SOptionTitleText2>
                  </Flex>
                </Flex>
                <Flex marginRight="5px">
                  <ChevronDownIcon width="25px" />
                </Flex>
              </Flex>
              <DropDown isselect={isselect}>
                {getSelectOptions().map((option) => {
                  const symbol = option.label.split('+ ')[1]
                  let f = 0
                  if (symbol !== prevpair) {
                    f = 1
                    prevpair = symbol
                  }
                  return (
                    <>
                      {f === 1 && (
                        <Flex height="50px" background={isDark ? '#070707' : '#F8F8F8'} alignItems="center" pl="12px">
                          {/* <TokenPairImage
                            // variant="inverted"
                            primaryToken={
                              symbol.includes('CAKE')
                                ? data.singleArray.find((single) => single?.quoteToken?.symbol === symbol)
                                  ?.quoteToken
                                : data.singleArray.find((single) => single?.quoteToken?.symbol === symbol)
                                  ?.token
                            }
                            secondaryToken={
                              symbol.includes('CAKE')
                                ? data.singleArray.find((single) => single?.quoteToken?.symbol === symbol)
                                  ?.token
                                : data.singleArray.find((single) => single?.quoteToken?.symbol === symbol)
                                  ?.quoteToken
                            }
                            width={28}
                            height={28}
                            primaryImageProps={{ style: { marginLeft: '4px' } }}
                            ml="20px"
                          /> */}
                          <Text color="#6F767E" fontWeight="600" ml="10px">
                            {symbol}
                          </Text>
                        </Flex>
                      )}
                      <Box background={isDark ? '#111315' : '#FFFFFF'}>
                        <DropDownItem
                          padding="10px 20px 10px 27px"
                          alignItems="center"
                          onClick={() => {
                            setIsSelect(false)
                            handleSelectChange(option)
                          }}
                        >
                          <Box mr="20px">
                            <StrategyIcon market={option.label.split(' ')[0].toLowerCase()} />
                          </Box>
                          <Flex justifyContent="space-between" style={{ cursor: 'pointer' }} width="100%">
                            <Text fontSize="14px" color={isDark ? 'white' : 'black'}>
                              {option.label.split(' ')[0]} {option.label.split(' ')[1]}
                            </Text>
                            <Text fontSize="14px" color={isDark ? 'white' : 'black'}>
                              {option.label.split(' ')[2]}
                            </Text>
                          </Flex>
                        </DropDownItem>
                      </Box>
                    </>
                  )
                })}
              </DropDown>
            </Box>
          </Flex>

          <Grid gridTemplateColumns="1fr 1fr" paddingTop="20px">
            <Flex flexDirection="column" justifyContent="center">
              <SmText color="#6F767E" fontSize="13px" mb="5px">
                {t('APY')}
              </SmText>
              {apy ? (
                <>
                  <SNumberText1>{apy}%</SNumberText1>
                  {Number(apy) > Number(apyOne) ? (
                    <SNumberText2 color="#83BF6E">{t(`${'\u2191'} %avgApy%% `, { avgApy })}</SNumberText2>
                  ) : (
                    <SNumberText2 color="#FF6A55">{t(`${'\u2193'} %avgApy%% `, { avgApy })}</SNumberText2>
                  )}
                  <SmText>{t('than 1x yield farm')}</SmText>
                </>
              ) : (
                <>
                  <Skeleton width="5rem" height="1rem" mb="1rem" />
                  <Skeleton width="8rem" height="1rem" />
                </>
              )}
            </Flex>
            <ReactEcharts option={getOption()} theme="Imooc" style={{ height: '76px' }} />
          </Grid>
        </Box>
        <Box padding="0.5rem 0">
          <Flex justifyContent="space-between" my="12px">
            <BigText color="#6F767E">{t('TVL')}</BigText>
            {tvl && !Number.isNaN(tvl) && tvl !== undefined ? (
              <BigText>{`$${nFormatter(tvl)}`}</BigText>
            ) : (
              <Skeleton width="80px" height="16px" />
            )}
          </Flex>

          <Flex justifyContent="space-between" my="12px">
            <BigText color="#6F767E">{t('Risk Level')}</BigText>
            <BigText color={color} fontWeight="bold">
              {riskLevel}
            </BigText>
          </Flex>
          <Flex justifyContent="space-between" my="12px">
            <BigText color="#6F767E">{t('Daily Earnings')}</BigText>
            {dailyEarnings ? (
              <SBigText>
                {t('%dailyEarnings% %quoteTokenSymbol% per %tokenSymbol%', {
                  dailyEarnings: dailyEarnings.toFixed(4),
                  quoteTokenSymbol,
                  tokenSymbol,
                })}
              </SBigText>
            ) : (
              <Skeleton width="5rem" height="1rem" />
            )}
          </Flex>
        </Box>
        {account ? (
          <Flex justifyContent="center">
            {singleData?.isStableQuoteToken === false || singleData?.isStableToken === false
              ? tooltipVisible && tooltip
              : null}
            {singleData?.isStableQuoteToken === false || singleData?.isStableToken === false ? (
              <span ref={targetRef}>
                <Button width="100%" disabled ref={targetRef}>
                  {t('Farm')}
                </Button>
              </span>
            ) : (
              <Button
                width="100%"
                as={Link}
                to={(location) => ({
                  ...location,
                  pathname: `${location.pathname}/farm/${singleData?.lpSymbol.replace(' LP', '')}`,
                  state: {
                    singleData,
                    marketStrategy: selectedStrategy,
                  },
                })}
              // disabled={!account || !apy}
              // onClick={(e) => !account || (!apy && e.preventDefault())}
              >
                {t('Farm')}
              </Button>
            )}
          </Flex>
        ) : (
          <Flex justifyContent="center">
            <Button width="100%" onClick={onPresentConnectModal}>
              {t('Farm')}
            </Button>
          </Flex>
        )}
      </CardBody>
    </Card>
  )
}

export default SingleAssetsCard
