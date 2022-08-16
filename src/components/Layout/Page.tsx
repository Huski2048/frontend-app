import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router'
import { DEFAULT_META, getCustomMeta } from 'config/constants/meta'
import Container from './Container'

const StyledPage = styled(Container)`
  display: flex;
  > div {
    margin-bottom: 14px;
    border-radius: 12px;
  }
  flex-direction: column;
  max-width: none;
  padding: 15px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 20px 20px;
  }
  ${({ theme }) => theme.mediaQueries.xxl} {
    padding: 22px 33.75px;
  }
`

const PageMeta = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  // const cakePriceUsd = usePriceCakeBusd()
  // const cakePriceUsdDisplay = cakePriceUsd.gt(0)
  //   ? `$${cakePriceUsd.toNumber().toLocaleString(undefined, {
  //       minimumFractionDigits: 3,
  //       maximumFractionDigits: 3,
  //     })}`
  //   : ''

  const pageMeta = getCustomMeta(pathname, t) || {}
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta }
  // const pageTitle = cakePriceUsdDisplay ? [title, cakePriceUsdDisplay].join(' - ') : title

  return (
    <Helmet>
      {/*       <title>{pageTitle}</title> */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Helmet>
  )
}

const Page: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <>
      <PageMeta />
      <StyledPage {...props}>{children}</StyledPage>
    </>
  )
}

export default Page
