import React from 'react'
import styled from 'styled-components'
import { BigText } from 'components/Text/Text'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

export const SApyCell = styled(BaseCell)`
  flex: 1 0 120px;
  ${({ theme }) => theme.screen.phone} {
    width: 100%;
    flex: 1;
  }
  ${CellContent} {
    ${({ theme }) => theme.screen.phone} {
      width: 100%;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }
  }
`

const ApyCell = ({ getApyData, token }) => {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()

  const apyCell = (e) => {
    const value = e * 100
    return `${value.toFixed(2)}%`
  }
  const { lendApr, stakeApr, totalApr, apy } = getApyData
  const tokenName = token?.token?.symbol

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small mr="8px">
          {t('Lending APR')}
        </Text>
        {lendApr ? <Text>{apyCell(lendApr)}</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small mr="8px">
          {t('Staking APR')}
        </Text>
        {stakeApr ? <Text>{apyCell(stakeApr.toNumber())}</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      {tokenName === 'ALPACA' && (
        <Flex justifyContent="space-between" alignItems="center">
          <Text small mr="8px">
            {t('Protocol APR')}
          </Text>
          <Skeleton width="80px" height="16px" />
        </Flex>
      )}
      <Flex justifyContent="space-between" alignItems="center">
        <Text small mr="8px">
          {t('Total APR')}
        </Text>
        {totalApr ? <Text>{apyCell(totalApr.toNumber())}</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small mr="8px">
          {t('Total APY')}
        </Text>
        {apy ? <Text>{apyCell(apy)}</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
    </>,
    { placement: 'bottom-start' },
  )

  return (
    <SApyCell role="cell">
      <CellContent>
        {isMobile && <BigText>{t('APY')}</BigText>}
        {apy ? (
          <Flex alignItems="center">
            <BigText>{apyCell(apy)}</BigText>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="5px" color="textSubtle" />
            </span>
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </SApyCell>
  )
}

export default ApyCell
