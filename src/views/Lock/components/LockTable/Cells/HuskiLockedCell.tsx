import React from 'react'
import styled from 'styled-components'
import { Text, Flex } from 'husky-uikit'
import { BigText } from 'components/Text/Text'
import { useTranslation } from 'contexts/Localization'
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
    border-right: none;
    ${Text}:first-child {
      display: none;
    }
    ${Text}:last-child {
      display: none;
    }
  }
`

const HuskiLockedCell = ({ sHuskiLocked }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <SContent>
        <Text>&nbsp;</Text>
        <BigText>
          {t('sHUSKI Locked-')}
        </BigText>
        {sHuskiLocked && <BigText> {sHuskiLocked} </BigText>}
        <BigText>
          44.03
        </BigText>
        <Text>&nbsp;</Text>
      </SContent>
    </StyledCell>
  )
}

export default HuskiLockedCell
