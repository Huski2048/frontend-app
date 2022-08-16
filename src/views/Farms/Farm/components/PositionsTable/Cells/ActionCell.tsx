import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Button } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

export const SActionCell = styled(BaseCell)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${CellContent} {
    align-items: unset;
  }
  > div {
    gap: 5px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    flex: 1 0 114px;
    flex-direction: column;
    justify-content: center;
  }
`

const SButton = styled(Button)`
  font-size: 14px;
  font-weight: 400;
  box-shadow: none;
  word-break: initial;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 114px;
  height: 34px;
  text-align: center;

  background: #ffffff;
  border: 1px solid #efefef;
  box-sizing: border-box;
  border-radius: 10px;
  ${({ theme }) => theme.screen.tablet} {
    height: 24px;
    width: 68px;
    border-radius: 6px;
    font-size: 10px;
  }
`

const ActionCell = ({ posData, name, positionId }) => {
  const { account } = useWeb3React()
  const { data, liquidationThresholdData } = posData
  const { t } = useTranslation()

  return (
    <SActionCell role="cell">
      <SButton
        as={Link}
        to={(location) => ({
          pathname: `${location.pathname}/adjust-position/${name
            .toUpperCase()
            .replace('WBNB', 'BNB')}?positionId=${positionId}`,
          state: { data, liquidationThresholdData },
        })}
        onClick={(e) => !account && e.preventDefault()}
      >
        {t('Adjust')}
      </SButton>
      <SButton
        style={{ marginTop: '4px' }}
        as={Link}
        to={(location) => ({
          pathname: `${location.pathname}/close-position/${name
            .toUpperCase()
            .replace('WBNB', 'BNB')}?positionId=${positionId}`,
          state: { data },
        })}
        onClick={(e) => !account && e.preventDefault()}
      >
        {t('Close')}
      </SButton>
    </SActionCell>
  )
}

export default ActionCell
