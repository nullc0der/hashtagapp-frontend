import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/App'
import * as Sentry from '@sentry/browser'
import { createMatomoInstance, MatomoProvider } from 'context/Matomo'
// import * as serviceWorker from './serviceWorker'

const matomoInstance = createMatomoInstance({
    urlBase: 'https://matomo.ekata.io',
    siteId: Number(process.env.REACT_APP_MATOMO_SITE_ID),
    disabled: process.env.NODE_ENV !== 'production', // optional, false by default. Makes all tracking calls no-ops if set to true.
})

ReactDOM.render(
    <MatomoProvider value={matomoInstance}>
        <App />
    </MatomoProvider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
if (process.env.NODE_ENV === 'production') {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
    })
}

// serviceWorker.register()
