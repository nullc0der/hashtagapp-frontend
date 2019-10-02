import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TwLogin from 'react-twitter-auth'

class TwitterLogin extends Component {
    handleTwitterLogin = res => {
        const { handleSocialLogin } = this.props
        if (res.status === 200) {
            res.json().then(data => {
                data.success
                    ? handleSocialLogin(data.uid, 'twitter')
                    : handleSocialLogin(null, 'twitter')
            })
        } else {
            res.json().then(() => handleSocialLogin(null, 'twitter'))
        }
    }

    render() {
        const twitterLoginUrl = `${process.env.REACT_APP_API_ROOT}/social/twitter/getusertoken/`
        const twitterRequestTokenUrl = `${process.env.REACT_APP_API_ROOT}/social/twitter/getrequesttoken/`

        return (
            <TwLogin
                tag="div"
                loginUrl={twitterLoginUrl}
                requestTokenUrl={twitterRequestTokenUrl}
                onSuccess={this.handleTwitterLogin}
                onFailure={err => console.log(err)}>
                {this.props.children}
            </TwLogin>
        )
    }
}

TwitterLogin.propTypes = {
    handleSocialLogin: PropTypes.func.isRequired
}

export default TwitterLogin
