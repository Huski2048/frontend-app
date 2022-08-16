import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Box, ChevronDownIcon, ChevronUpIcon } from 'husky-uikit'

import TotalHuskiLockedCell from './Cells/TotalHuskiLockedCell'
import ValueLockedCell from './Cells/ValueLockedCell'
import HuskiLockedCell from './Cells/HuskiLockedCell'
import NameCell from './Cells/NameCell'
import ApyCell from './Cells/ApyCell'
import UnlockDateCell from './Cells/UnlockDateCell'
import RewardsCell from './Cells/RewardsCell'
import LockCell from './Cells/LockCell'
import ClaimCell from './Cells/ClaimCell'

const StyledRow = styled.div`
  background-color: ${({ theme }) => theme.card.background};
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radii.small};
  padding: 0 20px;


  ${({ theme }) => theme.screen.tablet} {
    padding: 0 12px;
  }
  ${({ theme }) => theme.screen.tablet} {
    padding: 10px 20px;
    
  }

`

const ActionCell = styled(Box)<{ expanded: boolean }>`
  max-height: ${({ expanded }) => (expanded ? '1000px' : '0px')};
  border-top: 2px solid ${({ theme }) => theme.color.tableLine};
  opacity: ${({ expanded }) => (expanded ? '1' : '0')};
  overflow-y: hidden;
  transition: max-height 0.3s, opacity 0.3s;
`
const ActionBar = styled(Flex)`
  ${({ theme }) => theme.screen.phone} {
    padding: 10px 0;
    flex-direction: column;
  }
`

const ActionItem = styled(Flex)`
  margin: 0 50px 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.tableLine};
  align-items: center;
  ${({ theme }) => theme.screen.tablet} {
    margin: 0 40px;
  }
  ${({ theme }) => theme.screen.phone} {
    margin: 0;
    flex-direction : column!important;
  }
`

const SChevronUpIcon = styled(ChevronUpIcon)`
  margin-left: 40px;
  ${({ theme }) => theme.screen.phone} {
    margin-left: 0;
  }
`

const SChevronDownIcon = styled(ChevronDownIcon)`
  margin-left: 40px;
  ${({ theme }) => theme.screen.phone} {
    margin-left: 0;
  }
`

const LockRow = ({ lockData }) => {
  const sHuskiLocked = null
  const [expanded, setExpanded] = useState(false)
  return (
    <StyledRow role="row">
        <ActionBar onClick={() => setExpanded(!expanded)}>
          <NameCell data={lockData} />
          <ApyCell apy={lockData.apy} />
          <TotalHuskiLockedCell totalsHuskiLocked={lockData.totalsHuskiLocked} />
          <ValueLockedCell totalValueLocked={lockData.totalValueLocked} />
          <LockCell data={lockData} />
          {expanded ? <SChevronUpIcon /> : <SChevronDownIcon />}
        </ActionBar>
        <ActionCell expanded={expanded}>
          <ActionItem>
            <UnlockDateCell date={lockData.unlockDate} />
            <HuskiLockedCell sHuskiLocked={lockData.sHuskiLocked} />
            <RewardsCell rewards={lockData.rewards} />
            <ClaimCell sHuskiLocked={sHuskiLocked} />
          </ActionItem>
          <ActionItem>
            <UnlockDateCell date={lockData.unlockDate} />
            <HuskiLockedCell sHuskiLocked={lockData.sHuskiLocked} />
            <RewardsCell rewards={lockData.rewards} />
            <ClaimCell sHuskiLocked={sHuskiLocked} />
          </ActionItem>
          <ActionItem>
            <UnlockDateCell date={lockData.unlockDate} />
            <HuskiLockedCell sHuskiLocked={lockData.sHuskiLocked} />
            <RewardsCell rewards={lockData.rewards} />
            <ClaimCell sHuskiLocked={sHuskiLocked} />
          </ActionItem>
        </ActionCell>
    </StyledRow>
  )
}

export default LockRow
