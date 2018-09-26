import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

import {addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import fa from 'react-intl/locale-data/fa'

addLocaleData(en)
addLocaleData(fa)

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
