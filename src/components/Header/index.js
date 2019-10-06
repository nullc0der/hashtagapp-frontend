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
                        <a
                            href="https://www.basicincomeaction.org/"
                            className="header-logo">
                            <img
                                className="img-fluid logo-image"
                                alt="Basic Income Action Logo"
                                src={logo}
                            />
                            <p className="logo-text">BASIC INCOME ACTION</p>
                        </a>
                        <div className="header-buttons">
                            <div className="join-button">
                                <a
                                    className="btn btn-outline-dark btn-rounded"
                                    href="https://www.basicincomeaction.org/join">
                                    Join
                                </a>
                            </div>
                            <div className="donate-button">
                                <a
                                    className="btn btn-outline-dark btn-rounded"
                                    href="https://www.basicincomeaction.org/donate">
                                    Donate
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header
