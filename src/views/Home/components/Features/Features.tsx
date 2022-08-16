import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Box } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'

import StyledHeroSection from '../StyledHeroSection'
import Card from '../Card'

import { ReactComponent as SecurityFirst } from '../../assets/secfirst.svg'
import { ReactComponent as CommunityOwned } from '../../assets/community.svg'
import { ReactComponent as NoInvestors } from '../../assets/noinvestor.svg'
import { ReactComponent as FairLaunch } from '../../assets/fairlaunch.svg'

const Features = () => {
  const { t } = useTranslation()
  return (
    <>
      <Block>
        <Box mb={3}>
          <Text small color="#1A1A1F" textAlign="center">
            {t('FEATURES')}
          </Text>
          <Text bold fontSize="56px" color="#1A1A1F" textAlign="center">
            {t('Why Huski')}
          </Text>
        </Box>
        <Flex flexWrap="wrap" justifyContent="space-around" alignItems="center" p="50px 5vw 0">
          <Box>
            <Card>
              <SecurityFirst />
            </Card>
            <Text bold color="#1A1A1F" textAlign="center">
              {t('Security First')}
            </Text>
          </Box>
          <Box height="190px" width="4px" background="#F9F9F9" />
          <Box>
            <Card>
              <CommunityOwned />
            </Card>
            <Text bold color="#1A1A1F" textAlign="center">
              {t('Community Owned')}
            </Text>
          </Box>
          <Box height="190px" width="4px" background="#F9F9F9" />
          <Box>
            <Card>
              <NoInvestors />
            </Card>
            <Text bold color="#1A1A1F" textAlign="center">
              {t('No Investors')}
            </Text>
          </Box>
          <Box height="190px" width="4px" background="#F9F9F9" />
          <Box>
            <Card>
              <FairLaunch />
            </Card>
            <Text bold color="#1A1A1F" textAlign="center">
              {t('Fair Launch')}
            </Text>
          </Box>
        </Flex>
      </Block>
    </>
  )
}

const Block = styled(StyledHeroSection)`
  background-color: #ffffff;
`

export default Features
