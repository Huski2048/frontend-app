import styled from "styled-components";
import { Text,  Box} from 'husky-uikit'
import bgCorner from '../assets/Circles.svg'
import joinUs from '../assets/Linebg.svg'

const StyledHeroSection = styled(Box)`
padding: 5rem 10vw;
${Text} {
  font-family: 'GenJyuuGothic';
}
&.landing {
  background: #ecf2f6 url(${bgCorner});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  padding: 0 160px 80px;
  height: 100vh;
  @media screen and (max-width: 1200px) {
    padding-left: 80px;
    padding-right: 80px;
  }
  @media screen and (max-width: 900px) {
    padding-left: 40px;
    padding-right: 40px;
  }
  @media screen and (max-width: 500px) {
    padding-left: 20px;
    padding-right: 0px;
    padding-bottom: 40px;
  }
  @media screen and (min-width: 1300px) {
    padding-left: calc(50% - 560px);
    // padding-top: 320px;
  }
  > .slogan {
    font-family: 'BalooBhaijaan';
  }
}
&.join {
  background-image: url(${joinUs});
  background-position: left bottom;
  background-repeat: no-repeat;
  padding: 25px;
  position: relative;
  height: 700px;
  overflow: hidden;
  @media screen and (max-width: 1200px) {
    padding: 80px;
  }
  @media screen and (max-width: 900px) {
    background-position: top right;
    background-size: 50% 50vw;
    padding: 40px;
  }
  @media screen and (max-width: 500px) {
    padding: 40px 20px;
  }
}
`

export default StyledHeroSection

