import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import s from './SocialButton.module.scss'

class SocialButton extends Component {
    render() {
        const { className, buttonConf } = this.props
        const cx = classnames(s.container, className, 'btn-group')
        const buttonClass = classnames('btn', `btn-${buttonConf.className}`)

        return (
            <div className={cx}>
                <button className={buttonClass}>
                    <i className={buttonConf.icon} />
                </button>
                <button className={buttonClass}>{buttonConf.name}</button>
            </div>
        )
    }
}

SocialButton.propTypes = {
    buttonConf: PropTypes.shape({
        className: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }).isRequired
}

SocialButton.defaultProps = {
    buttonConf: {
        className: 'facebook',
        icon: 'facebook',
        name: 'Facebook'
    }
}

export default SocialButton
