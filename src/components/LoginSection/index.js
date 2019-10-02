import React, { Component } from 'react'
import classnames from 'classnames'

import SocialButton from 'components/SocialButton'
import FacebookLogin from 'components/FacebookLogin'
import TwitterLogin from 'components/TwitterLogin'

import imageBefore from 'assets/images/image-before.png'
import imageAfter from 'assets/images/image-after.png'

import s from './LoginSection.module.scss'

class LoginSection extends Component {
    render() {
        const { className, handleLogin } = this.props
        const cx = classnames(
            s.container,
            className,
            'container',
            'text-center'
        )
        return (
            <div className={cx}>
                <h2 className="app-name">BASIC INCOME HASHTAG APP</h2>
                <div className="app-demo mt-5">
                    <div className="demo-image mr-3">
                        <img
                            className="img-fluid"
                            alt="Before"
                            src={imageBefore}
                        />
                    </div>
                    <i className="fas fa-arrow-right" />
                    <div className="demo-image ml-3">
                        <img
                            className="img-fluid"
                            alt="After"
                            src={imageAfter}
                        />
                    </div>
                </div>
                <div className="login-buttons mt-3">
                    <FacebookLogin tag="div" handleSocialLogin={handleLogin}>
                        <SocialButton
                            buttonConf={{
                                className: 'facebook',
                                name: 'Facebook',
                                icon: 'fab fa-facebook'
                            }}
                        />
                    </FacebookLogin>
                    <TwitterLogin handleSocialLogin={handleLogin}>
                        <SocialButton
                            buttonConf={{
                                className: 'twitter',
                                name: 'Twitter',
                                icon: 'fab fa-twitter'
                            }}
                            className="mt-2"
                        />
                    </TwitterLogin>
                    <div
                        onClick={() => {
                            handleLogin(null, 'manual')
                        }}>
                        <SocialButton
                            buttonConf={{
                                className: 'manual',
                                name: 'Manual Upload',
                                icon: 'fas fa-arrow-up'
                            }}
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default LoginSection
