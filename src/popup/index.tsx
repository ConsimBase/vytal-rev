import React from 'react'
import { createRoot } from 'react-dom/client'

import Popup from './Popup'

const container = document.querySelector('#app-container')
if (container) {
  const root = createRoot(container)
  root.render(<Popup />)
}

if (module.hot) module.hot.accept()
