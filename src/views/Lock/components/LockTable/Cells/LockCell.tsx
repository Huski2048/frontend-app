import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Button } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  width: 120px;
  ${({ theme }) => theme.screen.tablet} {
    width: 80px;
  }
  ${({ theme }) => theme.screen.phone} {
    justify-content: center;
    width: 100%;
    align-items: center;
    margin: 0 0 20px 0;
  }
`

const SButton = styled(Button)`
  width: 114px;
  height: 40px;
  background-color: #7B3FE4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: ${({ theme }) => theme.radius.button};
  ${({ theme }) => theme.screen.tablet} {
    width: 68px;
    height: 24px;
    border-radius: 6px;
    font-size: 10px;
    box-shadow: none;
  }
`;

const LockCell = ({ data }) => {
  const { account } = useWeb3React()
  // const tokenData = token
  // const name = data.name
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent flex="1">
        <SButton
          as={Link}
          to={{
            pathname: `/lock/${data.name}`,
            state: { data },
          }}
          // disabled={!account}
          onClick={(e) => !account && e.preventDefault()}
        >
          {t('Lock')}
        </SButton>
      </CellContent>
    </StyledCell>
  )
}

export default LockCell
