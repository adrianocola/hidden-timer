import React from 'react'
import ReactDOM from 'react-dom/client'
import { HiddenTimer } from './HiddenTimer'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HiddenTimer />
  </React.StrictMode>,
)
