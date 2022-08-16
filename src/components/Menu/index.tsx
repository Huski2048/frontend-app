import React from 'react'
import { Menu as UikitMenu } from 'husky-uikit'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
// import useAuth from 'hooks/useAuth'
import { useHuskiPrice } from 'state/leverage/hooks'
import config from './config'
import UserMenu from './UserMenu'
import GlobalSettings from './GlobalSettings'

const Menu = (props) => {
  const { isDark, toggleTheme } = useTheme()
  const huskyPrice = useHuskiPrice()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { account } = useWeb3React()

  return (
    <UikitMenu
      userMenu={<UserMenu />}
      account={account}
      globalMenu={<GlobalSettings />}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      links={config(t)}
      huskiPriceUsd={new BigNumber(huskyPrice || 0).toFixed(2, 1)}
      {...props}
    />
  )
}

export default Menu
