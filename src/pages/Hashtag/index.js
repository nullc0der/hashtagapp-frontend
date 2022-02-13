import React, { Component } from 'react'

import { MatomoContext } from 'context/Matomo'

import Header from 'components/Header'
import LoginSection from 'components/LoginSection'
import HashtagSection from 'components/HashtagSection'
import Footer from 'components/Footer'

import './Hashtag.scss'

class HashTagPage extends Component {
    static contextType = MatomoContext

    state = {
        isLoggedIn: false,
        provider: '',
        uid: null,
    }

    handleLogin = (uid, provider) => {
        this.context.trackEvent({
            category: 'Login',
            action: 'Click',
            name: provider,
        })
        this.setState({
            isLoggedIn: provider.length,
            provider: provider,
            uid: uid,
        })
    }

    resetLogin = () => {
        this.setState({
            isLoggedIn: false,
            provider: '',
            uid: null,
        })
    }

    render() {
        const { isLoggedIn, uid, provider } = this.state
        return (
            <div className="hashtag-page">
                <Header />
                {isLoggedIn ? (
                    <HashtagSection
                        uid={uid}
                        provider={provider}
                        resetLogin={this.resetLogin}
                    />
                ) : (
                    <LoginSection handleLogin={this.handleLogin} />
                )}
                <Footer />
            </div>
        )
    }
}

export default HashTagPage
