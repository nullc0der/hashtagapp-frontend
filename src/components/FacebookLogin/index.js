import React, { Component } from 'react'
import PropTypes from 'prop-types'

function initFB(callback) {
    window.FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        version: 'v3.0'
    })
    callback()
}

export function injectFBSDK(callback) {
    const fbReady = window.FB && typeof window.FB === 'object'
    if (!fbReady) {
        ;(function(d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0]
            if (d.getElementById(id)) return
            js = d.createElement(s)
            js.id = id
            js.src = 'https://connect.facebook.net/en_US/sdk.js'
            fjs.parentNode.insertBefore(js, fjs)
        })(document, 'script', 'facebook-jssdk')
    }

    if (fbReady) {
        initFB(callback)
    } else {
        window.fbAsyncInit = () => initFB(callback)
    }
}

class FacebookLogin extends Component {
    state = {
        fb: {}
    }

    componentDidMount = () => {
        injectFBSDK(() => {
            window.FB.getLoginStatus(response => {
                this.setState({ fb: response })
            })
        })
    }

    facebookLogin = () => {
        const { handleSocialLogin } = this.props
        if (this.state.fb.status === 'connected') {
            handleSocialLogin(this.state.fb.authResponse.userID, 'facebook')
        } else {
            window.FB.login(function(response) {
                if (response.authResponse) {
                    handleSocialLogin(response.authResponse.userID, 'facebook')
                }
            })
        }
    }

    render() {
        const facebookBtn = React.createElement(
            this.props.tag,
            {
                onClick: this.facebookLogin,
                style: this.props.style,
                disabled: this.props.disabled,
                className: this.props.className
            },
            this.props.children ? (
                this.props.children
            ) : (
                <i className="fa fa-facebook" onClick={this.facebookLogin} />
            )
        )
        return facebookBtn
    }
}

FacebookLogin.propTypes = {
    handleSocialLogin: PropTypes.func.isRequired
}

export default FacebookLogin
