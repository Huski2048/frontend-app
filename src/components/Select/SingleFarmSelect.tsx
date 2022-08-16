import React, { useState, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { ArrowDropDownIcon, Text, Flex } from 'husky-uikit'
import { TokenImage } from 'components/TokenImage'
import useTheme from 'hooks/useTheme'

const DropDownHeader = styled.div<{ isDark: boolean }>`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 21px 0 6px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border: ${({ isDark }) => (isDark ? '1px solid #272B30' : '1px solid #efefef')};
  border-radius: 7px;
  background: ${({ isDark }) => (isDark ? '#1A1D1F' : 'white')};
  transition: border-radius 0.15s;
  .tokenImage {
    width: 12px;
    height: 12px;
    max-width: 12px;
    max-height: 12px;
    ${({ theme }) => theme.mediaQueries.xxl} {
      width: 18px;
      height: 18px;
      max-width: 18px;
      max-height: 18px;
    }
  }
`

const DropDownListContainer = styled.div<{ isDark: boolean }>`
  min-width: 136px;
  height: 0;
  position: absolute;
  overflow: hidden;
  background: ${({ isDark }) => (isDark ? '#1A1D1F' : 'white')};
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 198px;
  }
`
const DropDownListContainerToken = styled(DropDownListContainer)`
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 74px;
  }
`

const DropDownContainer = styled.div<{ isOpen: boolean; width: number; height: number }>`
  cursor: pointer;
  width: ${({ width }) => width};
  position: relative;
  background: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  height: 30px;
  min-width: 110px;
  user-select: none;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 198px;
  }

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        border-bottom: ${({ theme }) => (theme.isDark ? '1px solid #272B30' : '1px solid #efefef')};
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
        border-radius: 7px 7px 0 0;
      }

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        border: ${({ theme }) => (theme.isDark ? '1px solid #272B30' : '1px solid #efefef')};
        border-top-width: 0;
        border-radius: 0 0 7px 7px;
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
      }
    `}

  svg {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
  }
  ${Text} {
    font-size: 12px;
    ${({ theme }) => theme.mediaQueries.xxl} {
      font-size: 14px;
    }
  }
`
const DropDownContainerToken = styled(DropDownContainer)`
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 74px;
  }
`

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`

const ListItem = styled.li`
  list-style: none;
  padding: 7px;
  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
  .tokenImage {
    width: 12px;
    height: 12px;
    max-width: 12px;
    max-height: 12px;
    ${({ theme }) => theme.mediaQueries.xxl} {
      width: 18px;
      height: 18px;
      max-width: 18px;
      max-height: 18px;
    }
  }
`
const StrategyIcon = styled.div<{ market: string }>`
  width: 12px;
  aspect-ratio: 1;
  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 14px;
  }
  border-radius: 50%;
  background: ${({ market }) => {
    if (market.toLowerCase() === 'bear') {
      return '#FE6057'
    }
    if (market.toLowerCase() === 'bull') {
      return '#27C73F'
    }
    if (market.toLowerCase() === 'neutral') {
      return '#FCBD2C'
    }
    return null
  }};
`

export interface SelectProps {
  options: OptionProps[]
  onChange?: (option: OptionProps) => void
  reset?: any
}

export interface OptionProps {
  label: {
    name: string
    value?: string
  }
  value: any
  icon: any
}

const SingleFarmSelect: React.FunctionComponent<SelectProps> = ({ options, onChange }) => {
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const { isDark } = useTheme()

  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(!isOpen)
    event.stopPropagation()
  }

  const onOptionClicked = (selectedIndex: number) => () => {
    setSelectedOptionIndex(selectedIndex)
    setIsOpen(false)

    if (onChange) {
      onChange(options[selectedIndex])
    }
  }

  useEffect(() => {
    setContainerSize({
      width: dropdownRef.current.offsetWidth, // Consider border
      height: dropdownRef.current.offsetHeight,
    })

    const handleClickOutside = () => {
      setIsOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <DropDownContainer isOpen={isOpen} ref={containerRef} {...containerSize}>
      {containerSize.width !== 0 && (
        <DropDownHeader onClick={toggling} isDark={isDark}>
          <Flex alignItems="center" width="100%">
            {options[selectedOptionIndex].icon === 'bull' ||
            options[selectedOptionIndex].icon === 'bear' ||
            options[selectedOptionIndex].icon === 'neutral' ? (
              <StrategyIcon market={options[selectedOptionIndex].icon} />
            ) : (
              <TokenImage token={options[selectedOptionIndex].icon} width={12} height={12} />
            )}
            <Flex justifyContent="space-between" alignItems="center" width="100%">
              <Text color="#6F767E" paddingLeft="10px">
                {options[selectedOptionIndex].label.name}
              </Text>
              {options[selectedOptionIndex].label.value ? (
                <Text paddingRight="10px">{options[selectedOptionIndex].label.value}</Text>
              ) : null}
            </Flex>
          </Flex>
        </DropDownHeader>
      )}
      <ArrowDropDownIcon color="text" onClick={toggling} />
      <DropDownListContainer isDark={isDark}>
        <DropDownList ref={dropdownRef}>
          {options.map((option, index) =>
            index !== selectedOptionIndex ? (
              <ListItem onClick={onOptionClicked(index)} key={option.label.name + option.label.value}>
                <Flex alignItems="center">
                  {option.icon === 'bull' || option.icon === 'bear' || option.icon === 'neutral' ? (
                    <StrategyIcon market={option.icon} />
                  ) : (
                    <TokenImage token={option.icon} width={12} height={12} />
                  )}
                  <Flex justifyContent="space-between" alignItems="center" width="100%">
                    <Text color="#6F767E" paddingLeft="10px">
                      {option.label.name}
                    </Text>
                    {option.label.value ? <Text paddingRight="10px">{option.label.value}</Text> : null}
                  </Flex>
                </Flex>
              </ListItem>
            ) : null,
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default SingleFarmSelect

export const SingleFarmSelectToken: React.FunctionComponent<SelectProps> = ({ options, onChange, reset }) => {
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const { isDark } = useTheme()

  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(!isOpen)
    event.stopPropagation()
  }

  const onOptionClicked = (selectedIndex: number) => () => {
    setSelectedOptionIndex(selectedIndex)
    setIsOpen(false)

    if (onChange) {
      onChange(options[selectedIndex])
    }
  }

  useEffect(() => {
    setContainerSize({
      width: dropdownRef.current.offsetWidth, // Consider border
      height: dropdownRef.current.offsetHeight,
    })

    const handleClickOutside = () => {
      setIsOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  React.useEffect(() => {
    setSelectedOptionIndex(0)
  }, [reset])

  return (
    <DropDownContainerToken isOpen={isOpen} ref={containerRef} {...containerSize}>
      {containerSize.width !== 0 && (
        <DropDownHeader onClick={toggling} isDark={isDark}>
          <Flex alignItems="center" width="100%">
            <TokenImage token={options[selectedOptionIndex].icon} width={12} height={12} className="tokenImage" />
            <Text color="#6F767E" paddingLeft="5px">
              {options[selectedOptionIndex].label.name}
            </Text>
          </Flex>
        </DropDownHeader>
      )}
      <ArrowDropDownIcon color="text" onClick={toggling} />
      <DropDownListContainerToken isDark={isDark}>
        <DropDownList ref={dropdownRef}>
          {options.map((option, index) =>
            index !== selectedOptionIndex ? (
              <ListItem onClick={onOptionClicked(index)} key={option.label.name}>
                <Flex alignItems="center">
                  <TokenImage token={option.icon} width={12} height={12} className="tokenImage" />
                  <Text color="#6F767E" paddingLeft="5px">
                    {option.label.name}
                  </Text>
                </Flex>
              </ListItem>
            ) : null,
          )}
        </DropDownList>
      </DropDownListContainerToken>
    </DropDownContainerToken>
  )
}
