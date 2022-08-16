import React from 'react'
import styled from 'styled-components'
import Gif from './loading.gif'
import Page from '../Layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 200px);
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <img src={Gif} alt="loading" width="100px" />
      {/*       <img src={AnimatedSVG} alt="animated" /> */}
      {/*       <Loader /> */}
    </Wrapper>
  )
}

export default PageLoader
