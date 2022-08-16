import React from 'react'
import styled from 'styled-components'
import { BigText } from 'components/Text/Text'
import {
  Skeleton,
  Text,
  useMatchBreakpoints,
  Flex,
  InfoIcon,
  useTooltip,
  Grid,
} from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { TokenImage } from 'components/TokenImage'
import nFormatter from 'utils/nFormatter'
import BaseCell, { CellContent } from './BaseCell'

export const STvlCell = styled(BaseCell)`
  flex: 1 0 150px;
  ${({ theme }) => theme.screen.tablet} {
    flex: 1 0 100px;
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    padding-bottom: 10px;
  }
`

const TvlCell = ({ tvl, farmData, lpTokens, tokenNum, quoteTokenNum }) => {
  const { isMobile } = useMatchBreakpoints()
  const isSmallScreen = isMobile
  const { tokenPriceUsd, quoteTokenPriceUsd } = farmData
  const quoteToken = farmData?.quoteToken
  const token = farmData?.token
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text small>{t('TVL')}</Text>
      {tvl && lpTokens ? (
        <Text>
          {nFormatter(tvl)}&nbsp;({nFormatter(lpTokens.toNumber())}&nbsp;LP Tokens)
        </Text>
      ) : (
        <Skeleton width="80px" height="16px" />
      )}
      <Grid alignItems="center" gridTemplateRows="1fr" gridTemplateColumns="20px 1fr 1fr">
        <TokenImage token={token} width={20} height={20} />
        <Flex>
          <Text small mx="5px">
            {nFormatter(tokenNum.toNumber())}
          </Text>
          {tokenPriceUsd ? (
            <Text small>
              {token?.symbol.replace('wBNB', 'BNB')}&nbsp;(1&nbsp;{token?.symbol.replace('wBNB', 'BNB')}
              &nbsp;=&nbsp;{parseFloat(tokenPriceUsd).toFixed(2)}
              &nbsp;USD)
            </Text>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
      </Grid>
      <Grid alignItems="center" gridTemplateRows="1fr" gridTemplateColumns="20px 1fr 1fr">
        <TokenImage token={quoteToken} width={20} height={20} />
        <Flex>
          <Text small mx="5px">
            {nFormatter(quoteTokenNum.toNumber())}
          </Text>
          {quoteTokenPriceUsd ? (
            <Text small>
              {quoteToken?.symbol.replace('wBNB', 'BNB')}&nbsp;(1&nbsp;{quoteToken?.symbol.replace('wBNB', 'BNB')}
              &nbsp;=&nbsp;
              {parseFloat(quoteTokenPriceUsd).toFixed(2)}&nbsp;USD)
            </Text>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
      </Grid>
    </>,
    { placement: 'bottom-start' },
  )

  return (
    <STvlCell role="cell">
      <CellContent>
        {isSmallScreen && (
          <Text color="textSubtle" textAlign="left">
            {t('TVL')}
          </Text>
        )}
        <Flex alignItems="center">
          {tvl ? (
            <>
              <BigText>{nFormatter(tvl)}</BigText>
              {tooltipVisible && tooltip}
              <span ref={targetRef}>
                <InfoIcon ml="5px" color="#6F767E" />
              </span>
            </>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
      </CellContent>
    </STvlCell>
  )
}

export default TvlCell
