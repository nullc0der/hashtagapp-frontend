import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SketchPicker } from 'react-color'

import s from './ColorPicker.module.scss'
export default class ColorPicker extends Component {
    static propTypes = {
        onRequestClose: PropTypes.func.isRequired
    }

    componentDidMount = () => {
        document.addEventListener('mousedown', this.handleOutsideClick, false)
    }

    componentWillUnmount = () => {
        document.removeEventListener(
            'mousedown',
            this.handleOutsideClick,
            false
        )
    }

    handleOutsideClick = e => {
        if (this.container.contains(e.target)) {
            return
        }

        this.props.onRequestClose()
    }

    render() {
        const { color } = this.props

        return (
            <div className={s.container} ref={node => (this.container = node)}>
                <div className={s.inner}>
                    <SketchPicker
                        color={color}
                        onChangeComplete={this.props.onChange}
                    />
                </div>
            </div>
        )
    }
}
