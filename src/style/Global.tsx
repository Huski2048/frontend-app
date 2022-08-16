import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from 'husky-uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {
    gap: any;
    radius: any;
    screen: any;
    color: any;
  }
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'GenJyuuGothic';
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    img {
      height: auto;
      max-width: 100%;
    }
    input{
      box-shadow : none!important;
    }
    input:focus{
      outline: none!important;
      box-shadow : none!important;
    }
  }
`

export default GlobalStyle
