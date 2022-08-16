import React from 'react'
import styled from 'styled-components'
import { Skeleton } from 'husky-uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { BigText, SmText } from 'components/Text/Text'
import BaseCell from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.screen.phone} {
    height: 34px;
    flex: 1;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

const MyPosCell = ({ staked, name }) => {
  const { t } = useTranslation()


  return (
    <StyledCell role="cell">
      <SmText>
        {t('My Position')}
      </SmText>
      {staked ? (
        <PositionBigText>
          {new BigNumber(staked).toFixed(3, 1)} {name}
        </PositionBigText>
      ) : (
        <Skeleton width="80px" height="20px" />
      )}
    </StyledCell>
  )
}

export default MyPosCell

const PositionBigText = styled(BigText)`
  color:#9054DB
`
