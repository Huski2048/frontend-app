import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Flex, BoxProps, Text } from 'husky-uikit'
import styled from 'styled-components'

interface TabPanelProps extends BoxProps {
  children: React.ReactNode
  tabOne: { name: string; path?: string; setActive: () => void }
  tabTwo: { name: string; path?: string; setActive: () => void }
  replace?: boolean
  currentTab: string
}

const Panel = styled(Box)`
  background: ${({ theme }) => theme.card.background};
  border-radius: 12px;
  // disable blue overlay on mobile when clicked
  a {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    &:focus {
      outline: none !important;
    }
  }
`
const Header = styled(Flex)`
  border-radius: 12px;
  padding: 4px;
  background: ${({ theme }) => (theme.isDark ? '#111315' : '#f4f4f4')};
  > ${Flex} {
    position: relative;
    width: 100%;
  }
`

const Body = styled(Box)`
  > * {
    transition: all 0.5s linear;
  }
`
const HeaderTabs = styled(Text)<{ isActive }>`
  flex: 1 0 50%;
  cursor: pointer;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  height: 46px;
  color: ${({ theme, isActive }) => (isActive ? (theme.isDark ? 'white' : '#1A1D1F') : '#6F767E')};
`
const HeaderTabBg = styled(Box)<{ isFirstTab: boolean }>`
  border-radius: 12px;
  position: absolute;
  box-shadow: ${({ theme }) =>
    theme.isDark
      ? '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.06)'
      : '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.25)'};
  background-color: ${({ theme }) => (theme.isDark ? '#272B30' : '#FFFFFF')};
  width: 50%;
  height: 46px;
  transition: left 0.3s ease-in-out;
  left: ${({ isFirstTab }) => (isFirstTab ? '0px' : '50%')};
`
const TabPanel: React.FC<TabPanelProps> = ({
  tabOne,
  tabTwo,
  replace,
  children,
  currentTab,
  ...props
}) => {
  return (
    <Panel {...props}>
      <Header>
        <Flex>
          <HeaderTabBg isFirstTab={currentTab.toLowerCase() === tabOne.name.toLowerCase()} />
          <HeaderTabs
            as={tabOne.path ? Link : null}
            to={tabOne.path ? (location) => ({ ...location, pathname: tabOne.path }) : null}
            replace={replace}
            onClick={() => {
              tabOne.setActive()
            }}
            isActive={currentTab.toLowerCase() === tabOne.name.toLowerCase()}
          >
            {tabOne.name}
          </HeaderTabs>
          <HeaderTabs
            as={tabTwo.path ? Link : null}
            to={tabTwo.path ? (location) => ({ ...location, pathname: tabTwo.path }) : null}
            replace={replace}
            onClick={() => {
              tabTwo.setActive()
            }}
            isActive={currentTab.toLowerCase() === tabTwo.name.toLowerCase()}
          >
            {tabTwo.name}
          </HeaderTabs>
        </Flex>
      </Header>
      <Body>{children}</Body>
    </Panel>
  )
}

export default TabPanel
