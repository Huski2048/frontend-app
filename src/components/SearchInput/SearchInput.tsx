import React, { useState, useMemo } from 'react'
import { Input, Flex, SearchIcon } from 'husky-uikit'
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'

const StyledInput = styled(Input)<{ isDark: boolean }>`
  border: none;
  font-size: 15px;
  background: ${({ isDark }) => (isDark ? '#272B30' : '#F4F4F4')};
  margin-left: auto;
  padding-left: 30px;
  ${({ theme }) => theme.screen.tablet} {
    font-size: 12px;
  }
`

const InputWrapper = styled(Flex)`
  border-radius: 16px;
  width: 240px;
  position: relative;
  ${({ theme }) => theme.screen.tablet} {
    width: 200px;
  }
`

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const SearchInput: React.FC<Props> = ({ onChange: onChangeCallback, placeholder = 'Search' }) => {
  const [searchText, setSearchText] = useState('')

  const { t } = useTranslation()

  const debouncedOnChange = useMemo(
    () => debounce((e: React.ChangeEvent<HTMLInputElement>) => onChangeCallback(e), 500),
    [onChangeCallback],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debouncedOnChange(e)
  }

  const { isDark } = useTheme()
  return (
    <InputWrapper>
      <StyledInput value={searchText} onChange={onChange} placeholder={t(placeholder)} isDark={isDark} />
      <SearchIcon style={{ position: 'absolute', top: 12, left: 10, width: '19px', height: '19px' }} />
    </InputWrapper>
  )
}

export default SearchInput
