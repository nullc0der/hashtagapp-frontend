import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'

import isBoolean from 'lodash/isBoolean'

import s from './Dialog.module.scss'

export default class Dialog extends Component {
    componentDidMount = () => {
        if (this.props.isOpen) {
            document.addEventListener('click', this.handleClickOutside, false)
            document.addEventListener('keydown', this.closeOnEscapeKey, false)
            this.toggleBodyScroll(true)
        }
    }

    componentWillUnmount = () => {
        document.removeEventListener('keydown', this.closeOnEscapeKey, false)
        document.removeEventListener('click', this.handleClickOutside, false)
        this.toggleBodyScroll(false)
        if (this.dialogClosetimeOut) {
            clearTimeout(this.dialogClosetimeOut)
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.isOpen !== this.props.isOpen) {
            this.toggleBodyScroll(this.props.isOpen)
            if (this.props.isOpen) {
                document.addEventListener(
                    'click',
                    this.handleClickOutside,
                    false
                )
            } else {
                document.removeEventListener(
                    'click',
                    this.handleClickOutside,
                    false
                )
            }
        }
    }

    onRequestClose = () => {
        if (typeof this.props.onRequestClose === 'function') {
            this.dialogClosetimeOut = setTimeout(() => {
                this.props.onRequestClose()
                this.toggleBodyScroll(false)
            }, 700)
        }
    }

    closeOnEscapeKey = (e) => {
        if (e.which === 27) {
            this.onRequestClose()
        }
    }

    toggleBodyScroll = (force) => {
        if (isBoolean(force)) {
            return document.body.classList.toggle('modal-open', force)
        }

        document.body.classList.contains('modal-open')
            ? document.body.classList.remove('modal-open')
            : document.body.classList.add('modal-open')
    }

    handleClickOutside = (e) => {
        if (this.modalContent.contains(e.target)) {
            return
        }
        this.onRequestClose()
    }

    render() {
        const {
            className,
            isOpen,
            title,
            footer,
            showClose = true,
            hideModalContent = false,
        } = this.props

        const cx = classnames(s.container, 'ui-dialog modal', className, {
            show: isOpen,
        })
        // const backdropClass = classnames('modal-backdrop', {
        //     show: isOpen
        // })
        const modalContentClass = classnames('modal-content', {
            hide: hideModalContent,
        })

        const modalMarkup = (
            <div
                className={cx}
                tabIndex="-1"
                role="dialog"
                aria-labelledby="userLoginModal"
                aria-hidden="true">
                <div
                    className="modal-dialog modal-dialog-centered"
                    role="document">
                    <div
                        className={modalContentClass}
                        ref={(node) => (this.modalContent = node)}>
                        <div className="modal-header">
                            {!!title && (
                                <h5 className="modal-title"> {title} </h5>
                            )}
                            {!!showClose && (
                                <button
                                    type="button"
                                    className="close"
                                    aria-label="Close"
                                    onClick={this.onRequestClose}>
                                    <i className="fas fa-times" />
                                </button>
                            )}
                        </div>
                        <div className="modal-body">{this.props.children}</div>
                        {!!footer && (
                            <div className="modal-footer">{footer}</div>
                        )}
                    </div>
                </div>
            </div>
        )

        return ReactDOM.createPortal(
            modalMarkup,
            document.getElementById('modal-portal-root')
        )
    }
}
