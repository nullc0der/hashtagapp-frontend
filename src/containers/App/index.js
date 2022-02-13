import React, { Component } from 'react'

import { MatomoContext } from 'context/Matomo'
import HashtagPage from 'pages/Hashtag'
import './App.scss'

class App extends Component {
    static contextType = MatomoContext

    componentDidMount() {
        this.context.trackPageView()
    }

    render() {
        return (
            <div className="app-main">
                <HashtagPage />
            </div>
        )
    }
}

export default App
