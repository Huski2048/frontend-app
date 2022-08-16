import React from 'react'
import styled from 'styled-components'
import { SmText } from 'components/Text/Text'
import { useWeb3React } from '@web3-react/core'
import { Button } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  width: 140px;
  a {
    padding: 0.75rem;
    font-size: 14px;
    font-weight: 400;
    height: auto;
    box-shadow: none;
    word-break: initial;
  }
  ${({ theme }) => theme.screen.tablet} {
    width: 120px;
  }
  ${({ theme }) => theme.screen.phone} {
    margin: 0 0 40px;
    align-items: center;
  }
`

const SButton = styled(Button)`
  width: 114px;
  height: 40px;
  ${({ theme }) => theme.screen.tablet} {
    width: 68px;
    height: 24px;
    border: 1px solid #EFEFEF;
    border-radius: 6px;
    font-size: 10px;
    color: #fff;
    background: transparent;
    box-shadow: none;
  }
`

const ClaimCell = ({ sHuskiLocked }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent>
        <SButton
          disabled={!account || !sHuskiLocked}
          onClick={(e) => !account && e.preventDefault()}
        >
          <SmText>
            {' '}
            {t('Withdraw')}
          </SmText>
        </SButton>
      </CellContent>
    </StyledCell>
  )
}

export default ClaimCell
