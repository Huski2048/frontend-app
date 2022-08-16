import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { Text, Flex, Box, Heading, useMatchBreakpoints } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'

import StyledHeroSection from '../StyledHeroSection'
import Card from '../Card'

import { ReactComponent as TelegramIcon } from '../../assets/Telegram.svg'
import { ReactComponent as GitHubIcon } from '../../assets/Github.svg'
import { ReactComponent as TwitterIcon } from '../../assets/Twitter.svg'
import { ReactComponent as MediumIcon } from '../../assets/medium.svg'
import { ReactComponent as YouTubeIcon } from '../../assets/Youtube.svg'
import { ReactComponent as DiscordIcon } from '../../assets/Discord.svg'

const JoinUs = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet
  return (
    <>
      <Block>
        <Flex
          style={{
            marginTop: '70px',
            zIndex: 2200,
            marginLeft: isSmallScreen ? '0px' : '135px',
            marginRight: 'auto',
            maxWidth: '1120px',
          }}
        >
          <Box>
            <Box>
              <Heading
                color="#1A1A1F"
                style={{
                  marginTop: '40px',
                  fontWeight: 700,
                  fontSize: '48px',
                  paddingRight: '40%',
                  textAlign: 'left',
                }}
              >
                {t('Join us')}
              </Heading>
              <Text
                color="#1A1A1F"
                style={{
                  fontSize: '18px',
                  paddingRight: '10%',
                  textAlign: 'left',
                  marginTop: '30px',
                  position: 'relative',
                }}
              >
                {t('Join us on our social media channels for more updates & announcements.')}
              </Text>
            </Box>
            <Flex style={{ marginTop: 80, flexWrap: 'wrap' }}>
              <Card
                className="community"
                style={{
                  alignItems: 'start',
                  border: '1px solid #EAEAEA',
                  borderRadius: '25px',
                  padding: 10,
                  paddingLeft: 20,
                }}
                as={Link}
                to={{ pathname: 'https://t.me/HuskiFinance' }}
                target="_blank"
              >
                <SocialIcon>
                  <TelegramIcon width="48px" height="48px" />
                  <Text color="#1A1A1F" ml="1rem">
                    Telegram
                  </Text>
                </SocialIcon>
              </Card>
              <Card
                className="community"
                style={{
                  marginLeft: '20px',
                  alignItems: 'start',
                  border: '1px solid #EAEAEA',
                  borderRadius: '25px',
                  padding: 10,
                  paddingLeft: 20,
                }}
                as={Link}
                to={{ pathname: '/' }}
              >
                <SocialIcon>
                  <GitHubIcon width="48px" height="48px" />
                  <Text color="#1A1A1F" ml="1rem">
                    GitHub
                  </Text>
                </SocialIcon>
              </Card>
            </Flex>
            <Flex style={{ marginTop: '20px' }}>
              <Card
                className="community"
                style={{
                  alignItems: 'start',
                  border: '1px solid #EAEAEA',
                  borderRadius: '25px',
                  padding: 10,
                  paddingLeft: 20,
                }}
                as={Link}
                to={{ pathname: 'https://twitter.com/HuskiFinance' }}
                target="_blank"
              >
                <SocialIcon>
                  <TwitterIcon width="48px" height="48px" />
                  <Text color="#1A1A1F" ml="1rem">
                    Twitter
                  </Text>
                </SocialIcon>
              </Card>
              <Card
                className="community"
                style={{
                  marginLeft: '20px',
                  alignItems: 'start',
                  border: '1px solid #EAEAEA',
                  borderRadius: '25px',
                  padding: 10,
                  paddingLeft: 20,
                }}
                as={Link}
                to={{ pathname: 'https://medium.com/@huskifinance' }}
                target="_blank"
              >
                <SocialIcon>
                  <Box borderRadius="100%" border="1px solid #696969" height="48px" width="48px" p="4px">
                    <MediumIcon height="100%" width="100%" />
                  </Box>
                  <Text color="#1A1A1F" ml="1rem">
                    Medium
                  </Text>
                </SocialIcon>
              </Card>
            </Flex>
            <Flex style={{ marginTop: '20px' }}>
              <Card
                className="community"
                style={{
                  alignItems: 'start',
                  border: '1px solid #EAEAEA',
                  borderRadius: '25px',
                  padding: 10,
                  paddingLeft: 20,
                }}
                as={Link}
                to={{ pathname: 'https://www.youtube.com/channel/UCNpztgANmzvxhtScQmEh_Og' }}
                target="_blank"
              >
                <SocialIcon>
                  <YouTubeIcon width="48px" height="48px" />
                  <Text color="#1A1A1F" ml="1rem">
                    YouTube
                  </Text>
                </SocialIcon>
              </Card>
              <Card
                className="community"
                style={{
                  marginLeft: '20px',
                  alignItems: 'start',
                  border: '1px solid #EAEAEA',
                  borderRadius: '25px',
                  padding: 10,
                  paddingLeft: 20,
                }}
                as={Link}
                to={{ pathname: 'https://discord.com/channels/869829725365870592/869829725365870595' }}
                target="_blank"
              >
                <SocialIcon>
                  <DiscordIcon width="48px" height="48px" />
                  <Text color="#1A1A1F" ml="1rem">
                    Discord
                  </Text>
                </SocialIcon>
              </Card>
            </Flex>
            <Flex mt="75px" mb="80px">
              <Text color="#1A1A1F">Copyright&copy; 2021, HuskiFinance</Text>
              <Text color="#1A1A1F" mx="1rem" as={Link} to="/terms-conditions" style={{ textDecoration: 'underline' }}>
                {t('Terms & Conditions')}
              </Text>
              <Text color="#1A1A1F" as={Link} to="/privacy-policy" style={{ textDecoration: 'underline' }}>
                {t('Privacy Policy')}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Block>
    </>
  )
}

const Block = styled(StyledHeroSection)`
  background: #ffffff;
  background-image: url(/static/media/Linebg.4c83386f.svg);
  background-position: left bottom;
  background-repeat: no-repeat;
  padding: 25px;
  position: relative;
  height: 700px;
  overflow: hidden;
`

const SocialIcon = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  margin: 0 !important;
  @media screen and (max-width: 450px) {
    > img {
      width: 32px !important;
      height: 32px !important;
    }
    > svg {
      width: 32px !important;
      height: 32px !important;
    }
  }
`

export default JoinUs
