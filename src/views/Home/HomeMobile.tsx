import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Text, Flex, Box } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import { ReactComponent as CertikLogo } from './assets/certik.svg'
import { ReactComponent as Tokenomics } from './assets/tokenomics.svg'
import { ReactComponent as Roadmap } from './assets/roadmap.svg'
import { ReactComponent as SecurityFirst } from './assets/secfirst.svg'
import { ReactComponent as CommunityOwned } from './assets/community.svg'
import { ReactComponent as NoInvestors } from './assets/noinvestor.svg'
import { ReactComponent as FairLaunch } from './assets/fairlaunch.svg'
import { ReactComponent as TelegramIcon } from './assets/Telegram.svg'
import { ReactComponent as GitHubIcon } from './assets/Github.svg'
import { ReactComponent as TwitterIcon } from './assets/Twitter.svg'
import { ReactComponent as Wave } from './assets/wave.svg'
import { ReactComponent as HuskiLogo } from './assets/HuskiLogo.svg'
import { ReactComponent as WaveSides } from './assets/waveside.svg'
import { ReactComponent as Paw } from './assets/paw.svg'
import { ReactComponent as Snow } from './assets/snowflake.svg'
import { ReactComponent as MediumIcon } from './assets/medium.svg'
import { ReactComponent as YouTubeIcon } from './assets/Youtube.svg'
import { ReactComponent as DiscordIcon } from './assets/Discord.svg'
import { ReactComponent as Binance } from './assets/binance.svg'
import { ReactComponent as Zeppelin } from './assets/zeppelin.svg'
import { ReactComponent as Graph } from './assets/the-graph.svg'
import { ReactComponent as Ledger } from './assets/ledger.svg'
import { ReactComponent as Tether } from './assets/usdt.svg'
import { ReactComponent as PancakeSwap } from './assets/pancakeswap.svg'
import { ReactComponent as Eth } from './assets/eth.svg'
import { ReactComponent as Immunefi } from './assets/immunefi.svg'
import { ReactComponent as Trezor } from './assets/trezor.svg'
import HuskiLogoRoundIcon from './assets/huskiLogoRound'
// import { ReactComponent as ImmunefiPartner } from './assets/immunefi2.svg'
// import { ReactComponent as Kalata } from './assets/kalata.svg'
// import { ReactComponent as Farmation } from './assets/farmation.svg'
// import { ReactComponent as Wault } from './assets/wault.svg'

const StyledHeroSection = styled(Box)`
  text-align: center;
  padding: 40px 20px;
  overflow: hidden;
  &.landing {
    background: linear-gradient(146.45deg, #a981ff 24.67%, #7b40e4 66.59%) !important;
  }
  &.second {
    padding: 40px 40px;
    > * {
      margin: 0 auto;
    }
    > ${Flex} {
      padding: 1rem 0;
      justify-content: space-between !important;
      &:not(:last-child) {
        border-bottom: 1px solid #f9f9f9 !important;
      }
    }
  }
  &:not(.landing) {
    ${Text} {
      font-family: 'GenJyuuGothic' !important;
    }
  }
`

const Card = styled(Flex)`
  align-items: center;
  justify-content: center;
  &.learnMore {
    background: ${({ theme }) => theme.colors.backgroundAlt};
    box-shadow: 0px 0px 24px 0px rgba(123, 122, 123, 0.06);
    justify-content: space-between;
  }
  &.auditedBy {
    background: white;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.06) !important;
  }
  &.community {
    align-items: center;
    justify-content: unset;
    border: 1px solid #eaeaea;
    border-radius: 25px;
    padding: 0.5rem 1.25rem;
    width: 160px;
    &:not(:nth-last-child(-n + 2)) {
      margin-bottom: 0.5rem;
    }
  }
`

const BackedImage = styled(Box)`
  position: relative;
  height: 500px;
  > div {
    width: 140px;
    height: 80px;
    border-radius: 4px;
    box-shadow: 0px 0px 6px 6px rgba(0, 0, 0, 0.15);
    position: absolute;
  }
`
const StyledButton = styled.button`
  background-color: white;
  color: #7c41e4;
  font-family: 'GenJyuuGothic';
  font-weight: 700;
  padding: 1rem 0;
  width: 120px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const GlowSpot = styled(Box)`
  position: absolute;
  border-radius: 100%;
  width: 560px;
  height: 560px;
  background: #ebaec61a;
  &.top {
    left: -355px;
    top: -30%;
  }
  &.bottom {
    right: -395px;
    bottom: -35%;
  }
`
const Snowflake = styled(Snow)`
  position: absolute;
  &.opacity {
    opacity: 0.5;
  }
  * {
    fill: white;
  }
`
const AuditedBy = styled(Flex)`
  border-radius: 24px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.06);
  background: #ffffff;
  align-items: center;
  justify-content: center;
  padding: 15px 30px;
  width: fit-content;
  margin: 1.5rem auto;
`

const Home: React.FC = () => {
  const { t } = useTranslation()
  // document.querySelector('meta[name="theme-color"]').setAttribute('content', '#a981ff')

  return (
    <Box>
      <StyledHeroSection height="100vh" className="landing" position="relative">
        <GlowSpot className="top" />
        <GlowSpot className="bottom" />
        <Snowflake style={{ top: '85px', left: '100px' }} width="20px" height="20px" />
        <Snowflake style={{ top: '215px', left: '120px' }} width="15px" height="15px" className="opacity" />
        <Snowflake style={{ top: '420px', right: '80px' }} width="20px" height="20px" />
        <Snowflake style={{ top: '490px', left: '48%' }} width="15px" height="15px" className="opacity" />
        <Snowflake style={{ top: '640px', left: '80px' }} width="20px" height="20px" className="opacity" />
        <Box
          position="absolute"
          right="2rem"
          top="10vh"
          width="10px"
          height="10px"
          borderRadius="100%"
          background="#FEDC60"
        />
        <Box
          position="absolute"
          left="2rem"
          top="50vh"
          width="5px"
          height="5px"
          borderRadius="100%"
          background="#FEDC60"
        />
        <Box
          position="absolute"
          right="30%"
          top="15vh"
          width="5px"
          height="5px"
          borderRadius="100%"
          background="#ffffff40"
        />
        <Box
          position="absolute"
          right="25%"
          top="80vh"
          width="5px"
          height="5px"
          borderRadius="100%"
          background="#ffffff40"
        />
        <WaveSides style={{ position: 'absolute', top: '0', left: '0', marginLeft: '-10px' }} height="300px" />
        <WaveSides
          style={{ position: 'absolute', bottom: '0', right: '0', marginRight: '-10px', transform: 'scaleX(-1)' }}
          height="300px"
        />
        <Box
          borderRadius="100%"
          background="white"
          width="60px"
          height="60px"
          mx="auto"
          border="2px solid white"
          mt={4}
        >
          <HuskiLogo width="100%" height="100%" style={{ boxSizing: 'unset' }} />
        </Box>
        <Text
          color="white"
          fontSize="25px"
          my={4}
          fontFamily="BalooBhaijaan !important"
          letterSpacing="0.018em"
          style={{ whiteSpace: 'nowrap' }}
        >
          {t('Community-owned')}
        </Text>
        <Text
          color="white"
          fontSize="25px"
          my={4}
          fontFamily="BalooBhaijaan !important"
          letterSpacing="0.018em"
          style={{ whiteSpace: 'nowrap' }}
        >
          {t('Leveraged Yield Farming')}
        </Text>
        <Flex justifyContent="space-around" alignItems="center" my={5}>
          <StyledButton
            as={Link}
            to={{ pathname: 'https://docs.huski.finance/' }}
            target="_blank"
            style={{ zIndex: 99 }}
          >
            {t('Docs')}
          </StyledButton>
          <Paw width="25px" height="25px" />
          <StyledButton as={Link} to="/lend" style={{ zIndex: 99 }}>
            {t('Launch App')}
          </StyledButton>
        </Flex>
        <Wave width="100%" style={{ marginBottom: '2rem' }} />
        <Text
          color="white"
          fontSize="25px"
          fontFamily="BalooBhaijaan !important"
          letterSpacing="0.018em"
          style={{ whiteSpace: 'nowrap' }}
        >
          {t('Treat your Huskies')}
        </Text>
        <Text
          color="white"
          fontSize="25px"
          mt={4}
          fontFamily="BalooBhaijaan !important"
          letterSpacing="0.018em"
          style={{ whiteSpace: 'nowrap' }}
        >
          {t('and they will treat you more')}
        </Text>
        <Wave width="100%" style={{ margin: '2rem 0' }} />
      </StyledHeroSection>

      <StyledHeroSection height="100vh" className="second" background="white">
        <Box mb={3}>
          <Text bold fontSize="3" color="#1A1A1F">
            {t('Why Huski')}
          </Text>
          <Text small color="#1A1A1F">
            {t('FEATURES')}
          </Text>
        </Box>
        <Flex alignItems="center" justifyContent="space-around">
          <SecurityFirst width={120} />
          <Text bold color="#1A1A1F">
            {t('Security First')}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-around">
          <Text bold color="#1A1A1F">
            {t('Community Owned')}
          </Text>
          <CommunityOwned width={120} />
        </Flex>
        <Flex alignItems="center" justifyContent="space-around">
          <NoInvestors width={120} />
          <Text bold color="#1A1A1F">
            {t('No Investors')}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-around">
          <Text bold color="#1A1A1F">
            {t('Fair Launch')}
          </Text>
          <FairLaunch width={120} />
        </Flex>
      </StyledHeroSection>

      <StyledHeroSection background="white">
        <Box
          mx="auto"
          width="98%"
          borderRadius="20px 20px 0 0"
          background="linear-gradient(to right, #7C42E3 , #FEA989)"
          py="20px"
          mb="-10px"
        >
          <Text bold fontSize="20px" color="white">
            {t('HUSKI Finance')}
          </Text>
        </Box>
        <Box background="#2C353D" borderRadius="20px" p="30px">
          <Card
            justifyContent="space-between !important"
            borderRadius="20px"
            background="#22282E"
            width="100%"
            p="2rem"
          >
            <HuskiLogoRoundIcon width="90px" height="90px" />
            <Text color="white" bold>
              {t('Intro to HUSKI finance')}
            </Text>
          </Card>
          <Card
            justifyContent="space-between !important"
            borderRadius="20px"
            background="#22282E"
            width="100%"
            p="2rem"
            my="3rem"
          >
            <Text color="white" bold>
              {t('Tokenomics')}
            </Text>
            <Tokenomics width="90px" height="90px" />
          </Card>
          <Card
            justifyContent="space-between !important"
            borderRadius="20px"
            background="#22282E"
            width="100%"
            p="2rem"
          >
            <Roadmap width="90px" height="90px" />
            <Text color="white" bold>
              {t('Roadmap')}
            </Text>
          </Card>
        </Box>
      </StyledHeroSection>
      <StyledHeroSection background="white">
        <Text color="#1A1A1F">{t('Our contracts have been audited by')}</Text>
        <AuditedBy>
          <CertikLogo width="130px" />
        </AuditedBy>
        <Text color="#C7C7CA" small>
          {t('Our Contract have been audited by best audit auditing in this field')}
        </Text>
      </StyledHeroSection>
      <StyledHeroSection background="#2C353D">
        <Text color="white" fontSize="3" mb={3}>
          {t('Backed by the best')}
        </Text>
        <BackedImage>
          <Flex
            alignItems="center"
            justifyContent="center"
            style={{ top: '10%', left: '1rem', zIndex: 1 }}
            background="white"
          >
            <Binance width="20px" />
            <Text ml="5px" color="#2C3540" width="130px">
              Binance Smart Chain
            </Text>
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="center"
            style={{ top: '48%', left: '2rem', zIndex: 2 }}
            background="#2C353D"
          >
            <Tether width="20px" />
            <Text ml="5px" color="white">
              Tether
            </Text>
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="center"
            style={{ top: '35%', right: '0', zIndex: 2 }}
            background="#2C353D"
          >
            <Trezor width="20px" />
            <Text ml="5px" color="white">
              Trezor
            </Text>
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="center"
            style={{ top: '24%', left: '25%', zIndex: 2 }}
            background="#2C353D"
          >
            <Graph width="20px" />
            <Text ml="5px" color="white">
              The Graph
            </Text>
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="center"
            style={{ top: 'calc(10% + 1rem)', right: '1rem', zIndex: 3 }}
            background="white"
          >
            <Ledger width="20px" />
            <Text ml="5px" color="#2C3540">
              Ledger
            </Text>
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="center"
            style={{ top: '35%', left: '0', zIndex: 1 }}
            background="white"
          >
            <Zeppelin width="20px" />
            <Text ml="5px" color="#2C3540">
              Zeppelin
            </Text>
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="center"
            style={{ bottom: '15%', left: '15%', zIndex: 2 }}
            background="white"
          >
            <PancakeSwap width="20px" />
            <Text ml="5px" color="#2C3540">
              PancakeSwap
            </Text>
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="center"
            style={{ top: '63%', right: '1rem', zIndex: 1 }}
            background="#2C353D"
          >
            <Immunefi width="20px" />
            <Text ml="5px" color="white">
              Immunefi
            </Text>
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="center"
            style={{ top: '50%', right: '10%', zIndex: 3 }}
            background="white"
          >
            <Eth width="20px" />
            <Text ml="5px" color="#2C3540">
              Ethereum
            </Text>
          </Flex>
        </BackedImage>
        {/*   <Box>
          <Box mb={3}>
            <Text color="white" bold fontSize="3">
              {t('Our Partners')}
            </Text>
            <Text color="white" small>
              {t('Here are Huski Finance Partners')}
            </Text>
          </Box>
          <Flex justifyContent="space-between">
            <Box>
              <Flex alignItems="center" mb="1rem">
                <Box background="white" width="42px" p="5px" borderRadius="10px">
                  <Wault width="100%" />
                </Box>
                <Text bold small ml="10px" color="white">
                  Walt Finance
                </Text>
              </Flex>
              <Flex alignItems="center" mb="1rem">
                <Box background="white" width="42px" p="5px" borderRadius="10px">
                  <ImmunefiPartner width="100%" />
                </Box>
                <Text bold small ml="10px" color="white">
                  Immunefi
                </Text>
              </Flex>
              <Flex alignItems="center" mb="1rem">
                <Box background="white" width="42px" p="5px" borderRadius="10px">
                  <img src="/images/partner/Scientix_BNW.png" alt="Scientix" />
                </Box>
                <Text bold small ml="10px" color="white">
                  Scientix
                </Text>
              </Flex>
              <Flex alignItems="center" mb="1rem">
                <Box background="white" width="42px" p="5px" borderRadius="10px">
                  <Farmation width="100%" />
                </Box>
                <Text bold small ml="10px" color="white">
                  Farmation
                </Text>
              </Flex>
              <Flex alignItems="center" mb="1rem">
                <Box background="white" width="42px" p="5px" borderRadius="10px">
                  <img src="/images/partner/Berry Data_BNW.png" alt="Berry Data" />
                </Box>
                <Text bold small ml="10px" color="white">
                  Berry Data
                </Text>
              </Flex>
              <Flex alignItems="center" mb="1rem">
                <Box background="white" width="42px" p="5px" borderRadius="10px">
                  <img src="/images/partner/Alium_BNW.png" alt="PancakeSwap" />
                </Box>
                <Text bold small ml="10px" color="white">
                  Alium Finance
                </Text>
              </Flex>
            </Box>
            <Box borderLeft="1px solid #F0EFEF1A" />
            <Box>
              <Flex alignItems="center" mb="1rem">
                <Box background="white" width="42px" p="5px" borderRadius="10px">
                  <img src="/images/partner/PancakeSwap_BNW.png" alt="PancakeSwap" />
                </Box>
                <Text bold small ml="10px" color="white">
                  Pancake Swap
                </Text>
              </Flex>
              <Flex alignItems="center" mb="1rem">
                <Box background="white" width="42px" p="5px" borderRadius="10px">
                  <img src="/images/partner/Nexus_BNW.png" alt="Nexus Mutual" />
                </Box>
                <Text bold small ml="10px" color="white">
                  Nexus Mutural
                </Text>
              </Flex>
              <Flex alignItems="center" mb="1rem">
                <Box background="white" width="42px" p="5px" borderRadius="10px">
                  <img src="/images/partner/Orbs_BNW.png" alt="Orbs" />
                </Box>
                <Text bold small ml="10px" color="white">
                  Orbs
                </Text>
              </Flex>
              <Flex alignItems="center" mb="1rem">
                <Box background="white" width="42px" p="5px" borderRadius="10px">
                  <img src="/images/partner/Seascape_BNW.png" alt="Seascape" />
                </Box>
                <Text bold small ml="10px" color="white">
                  Seascape
                </Text>
              </Flex>
              <Flex alignItems="center" mb="1rem">
                <Box background="white" width="42px" p="5px" borderRadius="10px">
                  <img src="/images/partner/Itam_BNW.png" alt="Itam" />
                </Box>
                <Text bold small ml="10px" color="white">
                  Itam
                </Text>
              </Flex>
              <Flex alignItems="center" mb="1rem">
                <Box background="white" width="42px" p="5px" borderRadius="10px">
                  <Kalata width="100%" />
                </Box>
                <Text bold small ml="10px" color="white">
                  Kalata
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Box> */}
      </StyledHeroSection>
      <StyledHeroSection background="white">
        <Box mb={3}>
          <Text bold fontSize="3" color="#1A1A1F">
            {t('Join us')}
          </Text>
          <Text color="#1A1A1F" small>
            {t('Join us on our social media channels for more updates & announcements.')}
          </Text>
        </Box>
        <Flex flexWrap="wrap" justifyContent="space-between">
          <Card className="community" as={Link} to={{ pathname: 'https://t.me/HuskiFinance' }} target="_blank">
            <TelegramIcon width="32px" height="32px" />
            <Text color="#1A1A1F" bold small ml="1rem">
              Telegram
            </Text>
          </Card>
          <Card className="community" as={Link} to={{ pathname: '/' }}>
            <GitHubIcon width="32px" height="32px" />
            <Text color="#1A1A1F" bold small ml="1rem">
              GitHub
            </Text>
          </Card>
          <Card className="community" as={Link} to={{ pathname: 'https://twitter.com/HuskiFinance' }} target="_blank">
            <TwitterIcon width="32px" height="32px" />
            <Text color="#1A1A1F" bold small ml="1rem">
              Twitter
            </Text>
          </Card>
          <Card className="community" as={Link} to={{ pathname: 'https://medium.com/@huskifinance' }} target="_blank">
            <Box borderRadius="100%" border="1px solid #696969" height="32px" width="32px" p="4px">
              <MediumIcon height="100%" width="100%" />
            </Box>
            <Text color="#1A1A1F" bold small ml="1rem">
              Medium
            </Text>
          </Card>
          <Card
            className="community"
            as={Link}
            to={{ pathname: 'https://www.youtube.com/channel/UCNpztgANmzvxhtScQmEh_Og' }}
            target="_blank"
          >
            <YouTubeIcon width="32px" height="32px" />
            <Text color="#1A1A1F" bold small ml="1rem">
              YouTube
            </Text>
          </Card>
          <Card
            className="community"
            as={Link}
            to={{ pathname: 'https://discord.com/channels/869829725365870592/869829725365870595' }}
            target="_blank"
          >
            <DiscordIcon width="32px" height="32px" />
            <Text color="#1A1A1F" bold small ml="1rem">
              Discord
            </Text>
          </Card>
        </Flex>
      </StyledHeroSection>
      <StyledHeroSection display="flex" background="#2C353D" pt="10px !important">
        <Text color="white" small>
          Copyright&copy; 2021, HuskiFinance
        </Text>
        <Text color="white" small mx="1rem" as={Link} to="/terms-conditions" style={{ textDecoration: 'underline' }}>
          {t('Terms & Conditions')}
        </Text>
        <Text color="white" small as={Link} to="/privacy-policy" style={{ textDecoration: 'underline' }}>
          {t('Privacy Policy')}
        </Text>
      </StyledHeroSection>
    </Box>
  )
}

export default Home
