import React, { lazy } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { ResetCSS } from 'husky-uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollLeverageFarmsPublicData, usePollLeverageFarmsWithUserData } from 'state/leverage/hooks'
import { DatePickerPortal } from 'components/DatePicker'
import { usePollPoolsPublicData, usePollPoolsWithUserData } from 'state/pool/hooks'
import { useTradingFees, useVolume24hData } from './state/graph/hooks'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import PageLoader from './components/Loader/PageLoader'
import EasterEgg from './components/EasterEgg'
import history from './routerHistory'
// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import('./views/Home'))
const Lend = lazy(() => import('./views/Lend'))
const LendAction = lazy(() => import('views/Lend/LendAction/LendAction'))
const Stake = lazy(() => import('./views/Stake'))
const Lock = lazy(() => import('./views/Lock'))
const LockAction = lazy(() => import('./views/Lock/LockAction'))
const Leverage = lazy(() => import('./views/Farms'))
const ClosePosition = lazy(() => import('views/Farms/ClosePosition/ClosePosition'))
const AdjustPosition = lazy(() => import('views/Farms/AdjustPosition/AdjustPosition'))
const TwoSidesOptimal = lazy(() => import('views/Farms/OpenPosition/TwoSidesOptimal'))
const BaseTokenOnly = lazy(() => import('./views/Farms/OpenPosition/BaseTokenOnly'))
const AdjustPositionSA = lazy(() => import('./views/Farms/AdjustPosition/AdjustPositionSA'))
const ClosePositionSA = lazy(() => import('./views/Farms/ClosePosition/ClosePositionSA'))
const Claim = lazy(() => import('views/Farms/Claim'))
const PrivacyPolicy = lazy(() => import('views/PrivacyPolicy'))
const TermsConditions = lazy(() => import('views/TermsConditions'))



// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  useVolume24hData()
  useTradingFees()
  usePollBlockNumber()
  useEagerConnect()
  usePollPoolsPublicData()
  usePollLeverageFarmsPublicData()
  usePollPoolsWithUserData()
  usePollLeverageFarmsWithUserData()

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      {/* <GlobalCheckClaimStatus excludeLocations={['/collectibles']} /> */}
      <Menu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            {/* <Route path="/" exact>
              <Home />
            </Route>
            <Route exact path="/lend">
              <Lend />
            </Route> */}
            <Route path="/" exact>
              <Lend />
            </Route>
            <Route exact path="/lend">
              <Lend />
            </Route>
            <Route exact path="/lend/:action/:tokenName" component={LendAction} />
            <Route exact path="/stake">
              <Stake />
            </Route>
            <Route exact path="/lock">
              <Lock />
            </Route>
            <Route exact path="/lock/:token" component={LockAction} />
            <Route exact path="/farms">
              <Leverage farmType="default" />
            </Route>
            <Route exact path="/single-assets">
              <Leverage farmType="single" />
            </Route>
            <Route exact path="/farms/close-position/:token" component={ClosePosition} />
            <Route exact path="/farms/adjust-position/:token" component={AdjustPosition} />
            <Route exact path="/farms/farm/:token" component={TwoSidesOptimal} />
            <Route exact path="/*/claim" component={Claim} />{' '}
            {/* wildcard used to send single-assets/claim and farms/claim to same page/component */}
            <Route exact path="/single-assets/farm/:token" component={BaseTokenOnly} />
            <Route exact path="/single-assets/adjust-position/:token" component={AdjustPositionSA} />
            <Route exact path="/single-assets/close-position/:token" component={ClosePositionSA} />
            <Route exact path="/privacy-policy">
              <PrivacyPolicy />
            </Route>
            <Route exact path="/terms-conditions">
              <TermsConditions />
            </Route>
            {/*             <Route component={NotFound} /> */}
            <Route path="*">
              <Redirect to="/lend" />
            </Route>
          </Switch>
        </SuspenseWithChunkError>
      </Menu>
      <EasterEgg iterations={2} />
      <ToastListener />
      <DatePickerPortal />
    </Router>
  )
}

export default React.memo(App)
