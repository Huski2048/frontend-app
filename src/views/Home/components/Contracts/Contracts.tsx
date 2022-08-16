import React from 'react'
import styled from 'styled-components'

import { Text, Flex, Box } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'

import StyledHeroSection from '../StyledHeroSection'

import { ReactComponent as CertikLogo } from '../../assets/certik.svg'

const Contracts = () => {
  const { t } = useTranslation()
  return (
    <>
      <Block>
        <Box>
          <Text
            style={{ marginTop: '40px', fontWeight: 700, fontSize: '48px', textAlign: 'left' }}
            color="1A1A1F"
            width="457px"
          >
            {t('Our contracts have been audited by')}
          </Text>
          <Text
            style={{ fontSize: '18px', paddingRight: '10%', textAlign: 'left', marginTop: '30px' }}
            color="#1A1A1F"
            width="408px"
          >
            {t('Our Contract have been audited by best audit auditing in this field')}
          </Text>
        </Box>
        <Flex flexWrap="wrap" justifyContent="space-between" height="100%" alignItems="center">
          <AuditedBy mr="68px">
            <CertikLogo />
          </AuditedBy>
        </Flex>
      </Block>
    </>
  )
}

const Block = styled(StyledHeroSection)`
  background: #ECF2F6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const AuditedBy = styled(Flex)`
  border-radius: 24px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.06);
  background: #ffffff;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 100px;
`

export default Contracts
