import React from 'react'
import styled from 'styled-components'

import { Text, Flex, Box } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import StyledHeroSection from '../StyledHeroSection'
import { ReactComponent as Binance } from '../../assets/binance.svg'
import { ReactComponent as Zeppelin } from '../../assets/zeppelin.svg'
import { ReactComponent as Graph } from '../../assets/the-graph.svg'
import { ReactComponent as Ledger } from '../../assets/ledger.svg'
import { ReactComponent as Tether } from '../../assets/usdt.svg'
import { ReactComponent as PancakeSwap } from '../../assets/pancakeswap.svg'
import { ReactComponent as Eth } from '../../assets/eth.svg'
import { ReactComponent as Immunefi } from '../../assets/immunefi.svg'
import { ReactComponent as Trezor } from '../../assets/trezor.svg'

const Backed = () => {
  const { t } = useTranslation()
  return (
    <>
      <Block>
      <div style={{ width: '100%', top: 100, left: 0 }}>
          <div style={{ marginLeft: 'auto', marginRight: 'auto', paddingBottom: '80px' }}>
            <Text textAlign="center" fontSize="48px" style={{ paddingTop: '30px' }} color="white">
              {t('Backed by the best')}
            </Text>
            <BackedImage>
              <Flex>
                <Flex
                  background="white"
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    zIndex: 2,
                    marginLeft: '0px',
                    marginTop: '10px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Binance />
                  <Text ml="15px" color="#2C3540" width="130px">
                    Binance Smart Chain
                  </Text>
                </Flex>
                <Flex
                  background="#2C353D"
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    zIndex: 2,
                    marginLeft: '226px',
                    marginTop: '0px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Tether />
                  <Text ml="15px" color="white">
                    Tether
                  </Text>
                </Flex>
                <Flex
                  background="#2C353D"
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    zIndex: 2,
                    marginLeft: '147px',
                    marginTop: '20px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Trezor />
                  <Text ml="15px" color="white">
                    Trezor
                  </Text>
                </Flex>
              </Flex>

              <Flex>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  background="#2C353D"
                  style={{
                    marginLeft: '212px',
                    marginTop: '-38px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Graph />
                  <Text ml="15px" color="white">
                    The Graph
                  </Text>
                </Flex>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  background="white"
                  style={{
                    marginLeft: '175px',
                    marginTop: '-30px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Ledger />
                  <Text ml="15px" color="#2C3540">
                    Ledger
                  </Text>
                </Flex>
              </Flex>
              <Flex>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  background="white"
                  style={{
                    marginLeft: '0px',
                    marginTop: '-26px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Zeppelin />
                  <Text ml="15px" color="#2C3540">
                    Zeppelin
                  </Text>
                </Flex>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  background="white"
                  style={{
                    marginLeft: '92px',
                    marginTop: '20px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <PancakeSwap />
                  <Text ml="15px" color="#2C3540">
                    PancakeSwap
                  </Text>
                </Flex>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  background="#2C353D"
                  style={{
                    marginLeft: '100px',
                    marginTop: '-23px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Immunefi />
                  <Text ml="15px" color="white">
                    Immunefi
                  </Text>
                </Flex>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  background="white"
                  style={{
                    marginLeft: '24px',
                    marginTop: '22px',
                    width: '216px',
                    borderRadius: '4px',
                    height: '110px',
                    boxShadow: '0px 0px 18px 6px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <Eth />
                  <Text ml="15px" color="#2C3540">
                    Ethereum
                  </Text>
                </Flex>
              </Flex>
            </BackedImage>
          </div>
        </div>
      </Block>
    </>
  )
}

const Block = styled(StyledHeroSection)`
  background: #2c353d;
  position: relative;
`

const BackedImage = styled(Box)`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export default Backed
