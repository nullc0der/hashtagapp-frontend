import React, { Component } from 'react'
import classnames from 'classnames'

import logo from 'assets/images/logo.svg'

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
                            href="https://baza.foundation/"
                            className="header-logo">
                            <img
                                className="img-fluid logo-image"
                                alt="Baza Foundation Logo"
                                src={logo}
                            />
                            <p className="logo-text">BAZA FOUNDATION</p>
                        </a>
                        <div className="header-buttons">
                            <div className="join-button">
                                <a
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="btn btn-outline-dark btn-rounded"
                                    href="https://baza.foundation/signup">
                                    Signup
                                </a>
                            </div>
                            <div className="donate-button">
                                <a
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="btn btn-outline-dark btn-rounded"
                                    href="https://baza.foundation/#!donate">
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
