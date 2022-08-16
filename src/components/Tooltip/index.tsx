import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, useMatchBreakpoints, Box, InfoIcon, Skeleton } from 'husky-uikit'

interface TooltipWrapperParams {
  isTop?: boolean
  isLeft?: boolean
}
interface TooltipProps {
  isTop?: boolean
  isLeft?: boolean
}

const TooltipWrapper = styled(Box)<TooltipWrapperParams>`
  position: fixed;
  display: none;
  transform: translate(-2px, 1.5rem);
  ${({ theme }) => theme.mediaQueries.xl} {
    transform: translate(
      ${({ isLeft }) => (isLeft ? '0%' : '-50%')},
      ${({ isTop }) => (isTop ? 'calc(-100% - 0.5rem)' : '1.5rem')}
    );
  }
  padding: 1rem;
  gap: 10px;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.default};
  ${Text} {
    word-wrap: break-word;
    word-break: keep-all;
  }
`
const HasTooltip = styled(Box)`
  position: relative;
  &:hover ${TooltipWrapper} {
    display: inline-block;
    z-index: ${({ theme }) => theme.zIndices.modal};
    &,
    ${Flex} {
      gap: 10px;
    }
    > *:not(:last-child) {
      margin-bottom: 5px;
    }
  }
`

const Tooltip: React.FC<TooltipProps> = ({ children, ...props }) => {
  const [displayInfo, setDisplayInfo] = useState(false)
  const changeDisplayInfo = (e) => setDisplayInfo(!displayInfo)
  return (
    <>
      <HasTooltip
        onMouseEnter={changeDisplayInfo}
        onMouseLeave={changeDisplayInfo}
        position="relative"
        style={{ cursor: 'pointer' }}
      >
        <InfoIcon ml="10px" />
        <TooltipWrapper {...props}>{children}</TooltipWrapper>
      </HasTooltip>
    </>
  )
}

export default Tooltip
