import React, { useState } from 'react'
import { Box, Flex, Text, useMatchBreakpoints } from 'husky-uikit'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { TokenPairImage } from 'components/TokenImage'
import { useTranslation } from 'contexts/Localization'
import { useFarmFromWorker } from 'state/leverage/hooks'
import CloseDetails from './components/CloseDetails'

interface Props {
  active: boolean
}

const TabPanel = styled(Box)`
  padding: 2rem;
  padding-bottom: 1rem;
  @media screen and (max-width: 500px) {
    padding-left: 16px;
    padding-right: 16px;
  }
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: 0px 0px 10px 0px rgba(191, 190, 190, 0.29);
  border-radius: 20px;
  // width: 510px;
  // height: 528px;
`

const Header = styled(Flex)`
  margin-top: 20px;
  background: ${({ theme }) => (theme.isDark ? '#111315' : '#f4f4f4')};
  border-radius: 8px;
  padding: 4px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    border-radius: 12px;
  }
`

const HeaderTabs = styled.div<Props>`
  flex: 1 0 50%;
  box-shadow: ${({ active, theme }) =>
    active
      ? theme.isDark
        ? '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.06)'
        : '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.25)'
      : ''};
  background-color: ${({ active, theme }) => (active ? (theme.isDark ? '#272B30' : '#FFFFFF') : 'transparent')};
  padding: 4px;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme, active }) => (active ? (theme.isDark ? 'white' : '#1A1D1F') : '#6F767E')};
  ${({ theme }) => theme.mediaQueries.xxl} {
    border-radius: 12px;
    font-size: 14px;
    padding: 11px;
  }
`

const Body = styled(Flex)`
  flex-direction: column;
  gap: 1rem;
`
const Bubble = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #efefef;
  gap: 10px;
`
const TitleText = styled(Text)`
  font-size: 13px;
  font-weight: 700;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 20px;
  }
`
const MainText = styled(Text) <{ big?: boolean }>`
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: ${({ big }) => (big ? '16px' : '14px')};
  }
`
const SubText = styled(Text)`
  font-size: 10px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 12px;
  }
`

const ClosePosition = (props) => {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()

  const {
    location: {
      state: { data },
    },
  } = props
  const [isConvertTo, setIsConvertTo] = useState(true)

  const { positionId, worker } = data
  const farmData = useFarmFromWorker(worker)
  const {
    lpSymbol,
    token,
    quoteToken,
  } = farmData
  const symbolName = token.symbol.replace('wBNB', 'BNB')
  const lpSymbolName = lpSymbol
  const tokenValue = token
  const quoteTokenValue = quoteToken

  const handleWithdrawClick = () => isConvertTo && setIsConvertTo(false)
  const handleDepositClick = () => !isConvertTo && setIsConvertTo(true)
  return (
    <Page style={{ maxWidth: '850px', marginLeft: 'auto', marginRight: 'auto' }}>
      <TitleText mx="auto">{t('Close Position')}</TitleText>

      <TabPanel>
        <Flex alignItems="center" flexWrap="wrap">
          <Flex alignItems="center" justifySelf="flex-start" flex="1" mb="10px">
            <MainText mr="1rem" fontWeight="700" big>
              {t('Which method would you like to use?')}
            </MainText>
          </Flex>
          <Bubble alignSelf="flex-end" alignItems="center">
            <MainText>
              {symbolName.toUpperCase().replace('WBNB', 'BNB')} #{positionId}
            </MainText>
            <Flex alignItems="center" ml="10px">
              <Box width={isXxl ? 24 : 18} height={isXxl ? 24 : 18}>
                <TokenPairImage
                  primaryToken={tokenValue}
                  secondaryToken={quoteTokenValue}
                  width={isXxl ? 24 : 18}
                  height={isXxl ? 24 : 18}
                />
              </Box>
              <Flex flexDirection="column" ml="10px">
                <MainText style={{ whiteSpace: 'nowrap' }} fontWeight="500">
                  {lpSymbolName.replace(' PancakeswapWorker', '').toUpperCase().replace('WBNB', 'BNB')}
                </MainText>
                <SubText color="#6F767E" fontSize="12px">
                  {farmData.lpExchange}
                </SubText>
              </Flex>
            </Flex>
          </Bubble>
        </Flex>
        <Header>
          <HeaderTabs onClick={handleDepositClick} active={isConvertTo}>
            {t('Convert To')} {symbolName}
          </HeaderTabs>
          <HeaderTabs onClick={handleWithdrawClick} active={!isConvertTo}>
            {t('Minimize Trading')}
          </HeaderTabs>
        </Header>
        <Body>
          <CloseDetails data={data} isConvertTo={isConvertTo}/>
        </Body>
      </TabPanel>
    </Page>
  )
}

export default ClosePosition
