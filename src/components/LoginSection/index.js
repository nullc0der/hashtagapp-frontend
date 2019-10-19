import React, { Component } from 'react'
import classnames from 'classnames'

import SocialButton from 'components/SocialButton'
// import FacebookLogin from 'components/FacebookLogin'
import TwitterLogin from 'components/TwitterLogin'
import Dialog from 'components/Dialog'

import imageBefore from 'assets/images/image-before.png'
import imageAfter from 'assets/images/image-after.png'

import s from './LoginSection.module.scss'

class LoginSection extends Component {
    state = {
        isTwitterLoginInfoPopupOpen: false
    }

    onRequestCloseTwitterLoginInfoPopup = () => {
        this.setState({
            isTwitterLoginInfoPopupOpen: false
        })
    }

    onRequestOpenTwitterLoginInfoPopup = () => {
        this.setState({
            isTwitterLoginInfoPopupOpen: true
        })
    }

    render() {
        const { className, handleLogin } = this.props
        const cx = classnames(
            s.container,
            className,
            'container',
            'text-center'
        )
        const twitterLoginInfoPopupFooter = (
            <div className="d-flex mt-lg-0 mt-1">
                <div
                    className="btn btn-light btn-cancel"
                    onClick={this.onRequestCloseTwitterLoginInfoPopup}>
                    Cancel
                </div>
                <TwitterLogin handleSocialLogin={handleLogin}>
                    <div onClick={() => {}} className="btn btn-dark">
                        Proceed
                    </div>
                </TwitterLogin>
            </div>
        )

        return (
            <div className={cx}>
                <h2 className="app-name">HASHTAG APP</h2>
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
                    {/* <FacebookLogin tag="div" handleSocialLogin={handleLogin}>
                        <SocialButton
                            buttonConf={{
                                className: 'facebook',
                                name: 'Facebook',
                                icon: 'fab fa-facebook'
                            }}
                        />
                    </FacebookLogin> */}
                    <SocialButton
                        buttonConf={{
                            className: 'twitter',
                            name: 'Twitter',
                            icon: 'fab fa-twitter'
                        }}
                        className="mt-2"
                        onClick={this.onRequestOpenTwitterLoginInfoPopup}
                    />
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
                <Dialog
                    isOpen={this.state.isTwitterLoginInfoPopupOpen}
                    title="Important Notice"
                    className={s.container}
                    onRequestClose={this.onRequestCloseTwitterLoginInfoPopup}
                    footer={twitterLoginInfoPopupFooter}>
                    <p>
                        The basic income hashtag app is provided to spread
                        awareness and advocacy. Twitter does not allow us to
                        notify you on how we use your account or data.
                    </p>
                    <p>Things we do with your Twitter account -</p>
                    <ol>
                        <li>Download your profile image.</li>
                        <li>Upload modified image.</li>
                    </ol>
                    <p>Things we do not do with your Twitter account -</p>
                    <ol>
                        <li>Store your data.</li>
                    </ol>
                </Dialog>
            </div>
        )
    }
}

export default LoginSection
