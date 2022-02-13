import React from 'react'
import classnames from 'classnames'

import s from './CircularImage.module.scss'
const CircularImage = (props) => {
    const { className, src, alt = '', style, size = 48, ...otherProps } = props

    const cx = classnames(s.container, className)
    const combinedStyle = {
        width: size + 'px',
        height: size + 'px',
        ...style,
    }
    return (
        <div className={cx} style={combinedStyle} {...otherProps}>
            {!!src.length && (
                <img className="circular-img" alt={alt} src={src} />
            )}
        </div>
    )
}

export default CircularImage
