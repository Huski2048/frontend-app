import React, { useState, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { ArrowDropDownIcon, Text, Flex } from 'husky-uikit'
import useTheme from 'hooks/useTheme'

const DropDownHeader = styled.div<{ isDark: boolean }>`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border: ${({ isDark }) => (isDark ? '1px solid #272B30' : '1px solid #efefef')};
  border-radius: 12px;
  background: ${({ isDark }) => (isDark ? '#1A1D1F' : 'white')};
  transition: border-radius 0.15s;
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
    min-width: 110px;
  }
`
const StyledArrowDropDownIcon = styled(ArrowDropDownIcon)`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
`

const DropDownContainer = styled.div<{ isOpen: boolean; width: number; height: number }>`
  cursor: pointer;
  width: ${({ width }) => width}px;
  position: relative;
  background: ${({ theme }) => theme.colors.input};
  border-radius: 12px;
  height: 40px;
  min-width: 100%;
  width: 100%;
  user-select: none;
  padding-right: 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 110px;
  }

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        border-bottom: 1px solid #efefef;
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
        border-radius: 12px 12px 0 0;
      }

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        border: 1px solid #efefef;
        border-top-width: 0;
        border-radius: 0 0 12px 12px;
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
      }
    `}
`

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`

const ListItem = styled.li`
  list-style: none;
  padding: 8px 16px;
  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
`

export interface SelectProps {
  options: OptionProps[]
  onChange?: (option: OptionProps) => void
  icon: any
}

export interface OptionProps {
  label: string
  value: any
}

const Select: React.FunctionComponent<SelectProps> = ({ options, onChange, icon }) => {
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
      <Flex justifyContent="space-between">
        {containerSize.width !== 0 && (
          <DropDownHeader onClick={toggling} isDark={isDark}>
            <Flex>
              {icon}
              <Text>&nbsp;&nbsp;{options[selectedOptionIndex].label}</Text>
            </Flex>
            <ArrowDropDownIcon color="text" onClick={toggling} />
          </DropDownHeader>
        )}
      </Flex>
      <DropDownListContainer isDark={isDark}>
        <DropDownList ref={dropdownRef}>
          {options.map((option, index) =>
            index !== selectedOptionIndex ? (
              <ListItem onClick={onOptionClicked(index)} key={option.label}>
                <Flex justifyContent="flex-start" alignItems="start">
                  {icon}
                  <Text>&nbsp;&nbsp;{option.label}</Text>
                </Flex>
              </ListItem>
            ) : null,
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default Select
