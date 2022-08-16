import React from 'react'
import { useMatchBreakpoints } from 'husky-uikit'

import Header from './components/Header/Header'
import Features from './components/Features/Features'
import Finance from './components/Finance/Finance'
import Contracts from './components/Contracts/Contracts'
import Backed from './components/Backed/Backed'
import JoinUs from './components/JoinUs/JoinUs'

import HomeMobile from './HomeMobile'

const Home: React.FC = () => {
  const { isMobile } = useMatchBreakpoints()
  if (isMobile) {
    return <HomeMobile />
  }

  return (
    <>
      <Header />

      <Features />

      <Finance />

      <Contracts />

      <Backed />

      <JoinUs />
    </>
  )
}

export default Home
