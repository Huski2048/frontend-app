import React from 'react'
import styled from 'styled-components'
import { Text, Flex } from 'husky-uikit'
// import { useTranslation } from 'contexts/Localization'
import { BigText, HighLightText } from 'components/Text/Text'
import BaseCell from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1;
  ${({ theme }) => theme.screen.phone} {
    width: 100%;
    gap: 20px;
    justify-content: flex-start;
    border-right: none;
  }
`

const SContent = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  ${({ theme }) => theme.screen.phone} {
    width: 100%;
    gap: 20px;
    border-right: none;
    ${Text}:first-child {
      display: none;
    }
    ${Text}:last-child {
      display: none;
    }
  }
`

const RewardsCell = ({ rewards }) => {
  // const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <SContent>
        <Text>&nbsp;</Text>
        <BigText>
          {rewards}
        </BigText>
        <HighLightText>0.234</HighLightText>
        <Text> &nbsp; </Text>
      </SContent>
    </StyledCell>
  )
}

export default RewardsCell
