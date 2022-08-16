import React from 'react'
import { useThemeManager } from 'state/user/hooks'
import dogRunningLight from './480light.gif'
import dogRunningDark from './480dark.gif'

export const DogRunning = () => {
  const [isDark] = useThemeManager()
  return <img src={isDark ? dogRunningDark : dogRunningLight} alt="dog running" />
}
