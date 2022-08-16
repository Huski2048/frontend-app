import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Text, Flex, Box } from 'husky-uikit'
import BigNumber from 'bignumber.js'

const ItemBox = styled(Box)`
  cursor: pointer;
  > div > div {
    background-color: #959a9e !important;
  }
  width: 250px;
  h1 {
    color: #959a9e !important;
  }
  &:hover {
    h1 {
      color: white !important;
    }
  }

  &:hover > div > div {
    background-color: #ffffff !important;
  }
`

const ItemBoxComponenet = ({ src, text }) => {
  const [isShown, setIsShown] = useState(false)
  const t = src.replace('_BNW', '')
  return (
    <ItemBox
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
      className="community"
      style={{ alignItems: 'start', borderRadius: '25px', padding: '10px 0px' }}
    >
      <Flex alignItems="center" flexDirection="row" justifyContent="start" style={{ margin: 0 }}>
        <Box style={{ padding: '5px', borderRadius: '12px', width: '42px', height: '42px' }}>
          {!isShown ? (
            <img src={src} style={{ margin: 0 }} alt="" width="100%" height="100%" />
          ) : (
            <img src={t} style={{ margin: 0 }} alt="" width="100%" height="100%" />
          )}
        </Box>
        <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}</h1>
      </Flex>
    </ItemBox>
  )
}

export default ItemBoxComponenet
