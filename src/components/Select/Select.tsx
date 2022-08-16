import React, { useState, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { ArrowDropDownIcon, Text } from 'husky-uikit'
import useTheme from 'hooks/useTheme'

const DropDownHeader = styled.div<{ isDark: boolean }>`
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  padding: 0px 6px;
  border: ${({ isDark }) => (isDark ? '1px solid #272B30' : '1px solid #efefef')};
  border-radius: 10px;
  background: ${({ isDark }) => (isDark ? '#1A1D1F' : 'white')};
  transition: border-radius 0.15s;
  ${({ theme }) => theme.mediaQueries.xxl} {
    height: 40px;
    padding: 0px 16px;
  }
`

const DropDownListContainer = styled.div<{ isDark: boolean }>`
  min-width: 80px;
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
  ${({ theme }) => theme.mediaQueries.xxl} {
    min-width: 100px;
  }
`

const DropDownContainer = styled.div<{ isOpen: boolean; width: number; height: number; isDark: boolean }>`
  cursor: pointer;
  position: relative;
  background: ${({ theme }) => theme.colors.input};
  border-radius: 10px;
  height: 36px;
  width: ${({ width }) => width}px;
  min-width: 80px;
  user-select: none;
  ${({ theme }) => theme.mediaQueries.xxl} {
    height: 40px;
    min-width: 100px;
  }

  ${(props) =>
    props.isOpen &&
    css<{ isDark?: boolean }>`
      ${DropDownHeader} {
        // box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
        border-radius: 10px 10px 0 0;
      }

      ${DropDownListContainer} {
        height: auto;
        max-height: 300px;
        transform: scaleY(1);
        opacity: 1;
        border: ${({ theme }) => (theme.isDark ? '1px solid #272B30' : '1px solid #efefef')};
        border-top-width: 0;
        border-radius: 0 0 10px 10px;
        // box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
        overflow: auto;
      }
    `}

  svg {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
  }
`

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  overflow: auto;
`

const ListItem = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  list-style: none;
  padding: 8px 6px;
  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    padding: 8px 16px;
  }
`

const ListItemText = styled(Text)`
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.xxl} {
    font-size: 14px;
  }
`

export interface SelectProps {
  options: OptionProps[]
  onChange?: (option: OptionProps) => void
}

export interface OptionProps {
  label: string
  value: any
  icon?: React.ReactNode
}

const Select: React.FunctionComponent<SelectProps> = ({ options, onChange }) => {
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
    <DropDownContainer isOpen={isOpen} isDark={isDark} ref={containerRef} {...containerSize}>
      {containerSize.width !== 0 && (
        <DropDownHeader onClick={toggling} isDark={isDark}>
          {options[selectedOptionIndex]?.icon ? options[selectedOptionIndex]?.icon : null}
          <ListItemText>{options[selectedOptionIndex]?.label.toUpperCase().replace('WBNB', 'BNB')}</ListItemText>
        </DropDownHeader>
      )}
      <ArrowDropDownIcon color="text" onClick={toggling} />
      <DropDownListContainer isDark={isDark}>
        <DropDownList ref={dropdownRef}>
          {options.map((option, index) =>
            index !== selectedOptionIndex ? (
              <ListItem onClick={onOptionClicked(index)} key={option.label}>
                {option.icon ? option.icon : null}
                <ListItemText>{option.label.toUpperCase().replace('WBNB', 'BNB')}</ListItemText>
              </ListItem>
            ) : null,
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default Select
