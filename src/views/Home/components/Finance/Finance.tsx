import React from 'react'
import styled from 'styled-components'

import { Text, Flex, Box,useMatchBreakpoints } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'

import StyledHeroSection from '../StyledHeroSection'
import Card from '../Card'

import HuskiLogoRoundIcon from '../../assets/huskiLogoRound'
import { ReactComponent as Tokenomics } from '../../assets/tokenomics.svg'
import { ReactComponent as Roadmap } from '../../assets/roadmap.svg'

const Finance = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet
  return (
    <>
      <Block>
        <Box
          borderRadius="20px 20px 0 0"
          background="linear-gradient(to right, #7C42E3 , #FEA989)"
          width="92%"
          marginLeft="auto"
          marginRight="auto"
          paddingTop="20px"
          paddingBottom="20px"
        >
          <Text bold fontSize="48px" color="white" textAlign="center">
            {t('HUSKI Finance')}
          </Text>
        </Box>
        <Box
          background="#2C353D"
          marginLeft="auto"
          marginRight="auto"
          borderRadius="20px"
          padding="30px"
          marginTop="-2px"
        >
          <Flex justifyContent={isSmallScreen ? 'center' : 'space-between'} flexWrap="wrap">
            <Box width={isSmallScreen ? 190 : 320}>
              <Card
                style={{ background: '#22282E', placeContent: 'center' }}
                maxWidth={320}
                maxHeight={320}
                width="100%"
                height={isSmallScreen ? 190 : 320}
              >
                <HuskiLogoRoundIcon width="220px" height="220px" />
              </Card>
              <Text bold fontSize="20px" color="white" marginTop="20px" marginBottom="20px" textAlign="center">
                {t('Intro to HUSKI finance')}
              </Text>
            </Box>
            <Box width={isSmallScreen ? 190 : 320}>
              <Card
                className="learnMore"
                style={{ background: '#22282E', placeContent: 'center' }}
                maxWidth={320}
                maxHeight={320}
                width="100%"
                height={isSmallScreen ? 190 : 320}
              >
                <Tokenomics width="220px" height="220px" />
              </Card>
              <Text bold fontSize="20px" color="white" marginTop="20px" marginBottom="20px" textAlign="center">
                {t('Tokenomics')}
              </Text>
            </Box>
            <Box width={isSmallScreen ? 190 : 320}>
              <Card
                className="learnMore"
                style={{ background: '#22282E', placeContent: 'center' }}
                maxWidth={320}
                maxHeight={320}
                width="100%"
                height={isSmallScreen ? 190 : 320}
              >
                <Roadmap width="220px" height="220px" />
              </Card>
              <Text bold fontSize="20px" color="white" marginTop="20px" marginBottom="20px" textAlign="center">
                {t('Roadmap')}
              </Text>
            </Box>
          </Flex>
        </Box>
      </Block>
    </>
  )
}

const Block = styled(StyledHeroSection)`
  background: #ffffff;
`

export default Finance
