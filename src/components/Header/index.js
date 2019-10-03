import React, { Component } from 'react'
import classnames from 'classnames'

import logo from 'assets/images/logo.png'

import s from './Header.module.scss'

class Header extends Component {
    render() {
        const { className } = this.props
        const cx = classnames(s.container, className)

        return (
            <div className={cx}>
                <div className="container">
                    <div className="d-flex align-items-center justify-content-around">
                        <div className="header-logo">
                            <img
                                className="img-fluid logo-image"
                                alt="Basic Income Action Logo"
                                src={logo}
                            />
                            <p className="logo-text">BASIC INCOME ACTION</p>
                        </div>
                        <div className="donate-button">
                            <button className="btn btn-outline-dark btn-rounded">
                                Donate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header
