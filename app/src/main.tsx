import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { installLocalOnlyNetworkGuard } from './lib/core/networkGuard'
import './styles.css'

if (import.meta.env.DEV) {
  installLocalOnlyNetworkGuard()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
