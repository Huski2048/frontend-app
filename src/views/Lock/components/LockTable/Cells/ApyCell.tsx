import React from 'react'
import styled from 'styled-components'
import { BigText, SmText } from 'components/Text/Text'
import { Text, Flex, InfoIcon, useTooltip } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1;
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
    ${({ theme }) => theme.screen.phone} {
      width: 100%;
      gap: 20px;
    }
  }

`
const ApyCell = ({ apy }) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>{t('Assumes daily compounding')}</Text>
    </>,
    { placement: 'top-start' },
  )
  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex alignItems="center" style={{ margin: '-1px 0 5px 0' }}>
          <SmText>
            {t('APY')}
          </SmText>
          {tooltipVisible && tooltip}
          <span ref={targetRef} style={{ margin: '0 0 0 10px' }}>
            <InfoIcon color="textSubtle" style={{ width: '16.6px' }} />
          </span>
        </Flex>
        {apy ? (
          <BigText>
            {apy}%
          </BigText>
        ) : (
          <BigText>
            234.34%
          </BigText>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default ApyCell
