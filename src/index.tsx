import React from 'react'
import ReactDOM from 'react-dom'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import App from './App'
import Providers from './Providers'

function Updaters() {
  return (
    <>
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

// function Blocklist({ children }: { children: ReactNode }) {
//   const { account } = useActiveWeb3React()
//   const blocked: boolean = useMemo(() => Boolean(account && BLOCKED_ADDRESSES.indexOf(account) !== -1), [account])
//   if (blocked) {
//     return <div>Blocked address</div>
//   }
//   return <>{children}</>
// }

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <Updaters />
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
)
