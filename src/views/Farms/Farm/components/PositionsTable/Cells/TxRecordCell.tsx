import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Button, Flex } from 'husky-uikit'

import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

export const STxRecordCell = styled(BaseCell)`
  flex: 2 0 100px;
  > div {
    gap: 5px;
  }
  a {
    padding: 0.75rem;
    font-size: 14px;
    font-weight: 400;
    height: auto;
    box-shadow: none;
    word-break: initial;
  }
  ${({ theme }) => theme.screen.phone} {
    flex: 1;
    padding: 10px 0px;
  }
`

const TxRecordCell = () => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  return (
    <STxRecordCell role="cell">
      <Flex flexDirection="row">
        <CellContent style={{ marginTop: '-2px' }}>
          <Button
            style={{ width: '114px', height: '40px' }}
            as={Link}
            to={(location) => ({
              pathname: `${location.pathname}/txrecord`,
            })}
            onClick={(e) => !account && e.preventDefault()}
          >
            {t('Click to view')}
          </Button>
        </CellContent>
        <img style={{ marginLeft: '90px', marginTop: '-15px' }} src="/images/sitting_huski.svg" alt="" />
      </Flex>
    </STxRecordCell>
  )
}

export default TxRecordCell
