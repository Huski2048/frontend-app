import React from 'react'
import styled from 'styled-components'
import { Text, Flex } from 'husky-uikit'
import { BigText, SmText } from 'components/Text/Text'
// import { useTranslation } from 'contexts/Localization'
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
  border-right: 2px solid ${({ theme }) => theme.color.tableLine};
  ${({ theme }) => theme.screen.phone} {
    width: 100%;
    gap: 20px;
    justify-content: space-between;
    border-right: none;
    ${Text}:last-child {
      display: none;
    }
  }
`

const UnlockDateCell = ({ date }) => {
  // const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <SContent>
        <SmText>
          {date}
        </SmText>
        <BigText>July 13th, 2020</BigText>
        <Text>&nbsp;</Text>
      </SContent>
    </StyledCell>
  )
}

export default UnlockDateCell
