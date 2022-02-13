import React, { Component } from 'react'
import classnames from 'classnames'
import { get, sample } from 'lodash'
import { CSSTransitionGroup } from 'react-transition-group'

import SocialButton from 'components/SocialButton'
// import FacebookLogin from 'components/FacebookLogin'
import TwitterLogin from 'components/TwitterLogin'
import Dialog from 'components/Dialog'
import CircularImage from 'components/CircularImage'
import SVGTemplate from 'components/HashtagSection/SVGTemplate'
import { HASHTAGS } from 'components/HashtagSection/hashtags'

import imageBefore from 'assets/images/image-before.png'

import { getNonExistentPhoto } from 'api/hashtag'

import s from './LoginSection.module.scss'

const COLORS = [
    '#66BB6A',
    '#9CCC65',
    '#D4E157',
    '#FFEE58',
    '#FFA726',
    '#FF7043',
]

class LoginSection extends Component {
    state = {
        isTwitterLoginInfoPopupOpen: false,
        imageData: '',
        semiCircleColor: sample(COLORS),
        text: sample(HASHTAGS),
    }

    componentDidMount() {
        getNonExistentPhoto()
            .then((response) => {
                if (response.ok) {
                    this.setState({
                        imageData: get(response.data, 'image', imageBefore),
                    })
                } else {
                    this.setState({
                        imageData: imageBefore,
                    })
                }
            })
            .catch(() =>
                this.setState({
                    imageData: imageBefore,
                })
            )
    }

    onRequestCloseTwitterLoginInfoPopup = () => {
        this.setState({
            isTwitterLoginInfoPopupOpen: false,
        })
    }

    onRequestOpenTwitterLoginInfoPopup = () => {
        this.setState({
            isTwitterLoginInfoPopupOpen: true,
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
        const { imageData, semiCircleColor, text } = this.state
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
                    <CSSTransitionGroup
                        component={React.Fragment}
                        transitionName="demo-fade"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={200}>
                        {!!imageData && (
                            <div className="images-wrapper">
                                <div className="mr-3">
                                    <CircularImage size={128} src={imageData} />
                                </div>
                                <i className="fas fa-arrow-right fa-2x" />
                                <div className="ml-3">
                                    <SVGTemplate
                                        id="final-image-svg"
                                        text={text}
                                        textColor="#fff"
                                        semiCircleColor={semiCircleColor}
                                        imageData={imageData}
                                        showRounded={true}
                                    />
                                </div>
                            </div>
                        )}
                    </CSSTransitionGroup>
                    {!imageData && (
                        <i className="fas fa-spinner fa-3x fa-spin" />
                    )}
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
                            icon: 'fab fa-twitter',
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
                                icon: 'fas fa-arrow-up',
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
