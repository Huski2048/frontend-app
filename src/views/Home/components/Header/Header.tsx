import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { Text, Flex, Box, Button } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { HuskiIcon } from 'assets'

import StyledHeroSection from '../StyledHeroSection'

import { ReactComponent as MouseIcon } from '../../assets/MouseScroll.svg'




const Header = () => {
  const { t } = useTranslation()
  return (
    <>
      <Block>
      <Flex
          as="nav"
          justifyContent="space-between"
          alignItems="end"
          style={{ position: 'absolute', width: '100vw', zIndex: 100, background: 'transparent', paddingTop: '50px' }}
          top="0"
          left="0"
          px="10vw"
        >
          <Box width="50px" height="50px">
            <HuskiIcon width="100%" />
          </Box>
          <Flex justifyContent="flex-end" alignItems="center">
            <Button as={Link} to="/lend" style={{ background: 'white', color: 'black', border: 'none' }}>
              Launch App
            </Button>
          </Flex>
        </Flex>
        <Box position="absolute" bottom="155px">
          <Box>
            <Text
              style={{ maxWidth: '690px' }}
              color="#1A1A1F"
              fontSize="70px"
              fontFamily="BalooBhaijaan !important"
              className="slogan"
            >
              Treat your huskies and they will treat you more
            </Text>
            <Text color="#3E3C46" fontFamily="'GenJyuuGothic' !important" fontSize="20px" lineHeight="29px" mt="70px">
              {t('Community-owned Leveraged Yield Farming')}
            </Text>
            <Text color="#3E3C46" fontFamily="'GenJyuuGothic' !important" fontSize="20px" lineHeight="29px">
              {t('Liquidity as a Service')}
            </Text>
          </Box>
          <Flex
            style={{ marginTop: '20px', maxWidth: '320px', position: 'relative', zIndex: 999 }}
            justifyContent="space-between"
          >
            <Button as={Link} to="/lend" style={{ border: 'none' }} height={56}>
              Launch App
            </Button>
            <Button
              style={{
                background: 'transparent',
                color: '#1A1A1F',
                borderColor: '#1A1A1F',
                fontSize: '16px',
                padding: '0',
                margin: '0',
              }}
              variant="secondary"
              ml="1rem"
              as={Link}
              to={{ pathname: 'https://docs.huski.finance/' }}
              target="_blank"
              width={133}
              height={56}
            >
              {t('Learn More')}
            </Button>
          </Flex>
        </Box>
        <Box
          role="button"
          width="fit-content"
          onClick={() => window.scrollBy(0, window.innerHeight)}
          tabIndex={0}
          zIndex={99}
          position="absolute"
          bottom="70px"
          left="50%"
          style={{
            transform: 'translateX(-50%)',
          }}
        >
          <MouseIcon onClick={() => window.scrollBy(0, window.innerHeight)} style={{ cursor: 'pointer' }} />
        </Box>
        <GlowSpot />
      </Block>
    </>
  )
}

const Block = styled(StyledHeroSection)`
    background: #ecf2f6 url(/static/media/Circles.0a0c900a.svg);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
    padding: 0 160px 80px;
    height: 100vh;
`

const GlowSpot = styled(Box)`
  position: absolute;
  border-radius: 100%;
  width: 560px;
  height: 560px;
  left: -468px;
  top: 515px;
  background: linear-gradient(135.15deg, #ae80dc 1.17%, #dc83c3 31.88%, #8084dc 65.46%);
  mix-blend-mode: normal;
  opacity: 0.5;
  filter: blur(150px);
`

export default Header
