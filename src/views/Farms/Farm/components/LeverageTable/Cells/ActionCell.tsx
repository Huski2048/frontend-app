import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useMatchBreakpoints, Button, useTooltip, Text, useWalletModal } from 'husky-uikit'
import { useWorkerAcceptDebt } from 'state/leverage/hooks'
import { useTranslation } from 'contexts/Localization'
import useAuth from 'hooks/useAuth'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  padding: 10px 0px;
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
  }
`
const StyledButton = styled(Button)`
  background-color: ${({ disabled }) => (disabled ? '#D3D3D3' : '#7B3FE4')};
  box-sizing: border-box;
  border-radius: 10px;
  width: 114px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ disabled }) => (disabled ? '#6F767E' : 'white')};
  ${({ theme }) => theme.screen.tablet} {
    width: 56px;
    height: 24px;
    border-radius: 6px;
    font-size: 10px;
  }
`

const ActionCell = ({ farmData, selectedLeverage, selectedBorrowing }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const acceptDebt = useWorkerAcceptDebt(farmData.config, farmData.workerAddress)

  console.warn('Shoud change to  acceptDebt > 0 ? 0 : 1', acceptDebt)
  const selectedTokenShouldDisable = 0 // acceptDebt > 0 ? 0 : 1

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<Text>{t('Disabled')}</Text>, { placement: 'top-start' })

  const { login, logout } = useAuth()
  const hasProvider: boolean = !!window.ethereum || !!window.BinanceChain
  const { onPresentConnectModal } = useWalletModal(login, logout, hasProvider)

  return (
    <StyledCell role="cell" style={{ alignItems: isMobile || isTablet ? 'center' : null }}>
      {account ? (
        <CellContent>
          {selectedTokenShouldDisable ? tooltipVisible && tooltip : null}
          {selectedTokenShouldDisable ? (
            <span ref={targetRef}>
              <StyledButton disabled ref={targetRef}>
                {t('Farm')}
              </StyledButton>
            </span>
          ) : (
            <StyledButton
              as={Link}
              to={(location) => ({
                pathname: `${location.pathname}/farm/${farmData?.lpSymbol}`,
                state: { pid: farmData.pid, selectedLeverage, selectedBorrowing },
              })}
            >
              {t('Farm')}
            </StyledButton>
          )}
        </CellContent>
      ) : (
        <CellContent>
          <StyledButton onClick={onPresentConnectModal}>{t('Farm')}</StyledButton>
        </CellContent>
      )}
    </StyledCell>
  )
}

export default ActionCell
