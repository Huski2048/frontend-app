import React from 'react'
import { ChevronRightIcon, Flex, InfoIcon, Skeleton, Text } from 'husky-uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'

const MainText = styled(Text)`
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 14px;
  }
  span {
    vertical-align: middle;
    display: inline-flex;
    margin-left: 5px;
    svg {
      width: 12px;
      ${({ theme }) => theme.mediaQueries.xxl} {
        width: 14px;
      }
    }
  }
`

const ValueText = styled(Text)`
  font-size: 12px;
  font-weight: 700;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 14px;
  }
`

const InfoItem = ({
  main,
  value,
  toValue = null,
  tooltipVisible = null,
  tooltip = null,
  targetRef = null
}) => {
  const { t } = useTranslation()

  return (
    <Flex justifyContent="space-between">
      <MainText>
        {t(main)}
        {tooltipVisible && tooltip}
        {targetRef ? (<span ref={targetRef}><InfoIcon color="#6F767E" /></span>) : null}
      </MainText>

      {value ? (
        <Flex alignItems="center">
          <ValueText>{value}</ValueText>
          {toValue ? (<><ChevronRightIcon fontWeight="bold" /><ValueText>{toValue}</ValueText></>) : null}
        </Flex>)
        : (
          <Skeleton width="80px" height="16px" />
        )}
    </Flex>
  )
}

export default InfoItem
