import React, { useEffect, useRef } from 'react'

const SVGTemplate = ({
    id,
    text,
    semiCircleColor,
    textColor,
    imageData,
    showRounded = false,
    countryImage = '',
    emojiImage = '',
}) => {
    const textRef = useRef(null)
    const flagImgRef = useRef(null)
    const emojisRef = useRef(null)

    useEffect(() => {
        if (countryImage.length) {
            const { x, y } = textRef.current.getEndPositionOfChar(
                text.length - 1
            )
            const rotation = textRef.current.getRotationOfChar(text.length - 1)
            flagImgRef.current.setAttribute('x', x)
            flagImgRef.current.setAttribute('y', y - 13)
            flagImgRef.current.setAttribute('href', countryImage)
            flagImgRef.current.setAttribute('xlink:href', countryImage)
            flagImgRef.current.setAttribute(
                'transform',
                `rotate(${rotation} ${x} ${y})`
            )
        }
    }, [text, countryImage])

    useEffect(() => {
        if (emojiImage.length) {
            const { x, y } = textRef.current.getStartPositionOfChar(0)
            const rotation = textRef.current.getRotationOfChar(0)
            const emojiImageEl = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'image'
            )
            emojiImageEl.setAttribute('href', emojiImage)
            emojiImageEl.setAttribute('xlink:href', emojiImage)
            emojiImageEl.setAttribute('width', 14)
            emojiImageEl.setAttribute('height', 14)
            emojiImageEl.setAttribute('x', x - 14)
            emojiImageEl.setAttribute('y', y - 14)
            emojiImageEl.setAttribute(
                'transform',
                `rotate(${rotation} ${x} ${y})`
            )
            emojisRef.current.replaceChildren(emojiImageEl)
        }
    }, [text, emojiImage])

    return (
        <svg
            id={id}
            className="svg-template-image"
            width="128px"
            height="128px"
            viewBox="0 0 128 128"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs>
                <linearGradient
                    x1="49.9999956%"
                    y1="28.5381551%"
                    x2="50%"
                    y2="104.247525%"
                    id="linearGradient-1">
                    <stop
                        stopColor={semiCircleColor}
                        stopOpacity="0"
                        offset="0%"></stop>
                    <stop
                        stopColor={semiCircleColor}
                        stopOpacity="0.1"
                        offset="13.2351127%"></stop>
                    <stop stopColor={semiCircleColor} offset="100%"></stop>
                </linearGradient>
                <path
                    d="M0,63a63,63 0 1,0 126,0a63,63 0 1,0 -126,0"
                    id="curvedText"></path>
            </defs>
            <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd">
                <g
                    id="ImageTemplate"
                    transform="translate(0.000000, -0.200000)">
                    {imageData.length ? (
                        showRounded ? (
                            <foreignObject
                                x="0"
                                y="0"
                                width="128px"
                                height="128px">
                                <img
                                    width="128px"
                                    height="128px"
                                    src={imageData}
                                    style={{
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                    }}
                                    alt=""
                                />
                            </foreignObject>
                        ) : (
                            <image
                                id="Bitmap"
                                x="0"
                                y="0"
                                width="128"
                                height="128"
                                href={imageData}
                                xlinkHref={imageData}
                            />
                        )
                    ) : (
                        <circle cx={64} cy={64} r={64} fill="#e9ebed" />
                    )}
                    <g
                        id="outerContainer"
                        fill="transparent"
                        fillRule="nonzero">
                        <path
                            d="M64,128 L0,128 L0,64 C4.21884749e-15,99.346224 28.653776,128 64,128 Z"
                            id="Shape"
                        />
                        <path
                            d="M0,64 L0,0 L64,0 C28.653776,-2.164332e-15 4.21884749e-15,28.653776 0,64 Z"
                            id="Shape"
                        />
                        <path
                            d="M128,0 L128,64 C128,28.653776 99.346224,2.164332e-15 64,0 L128,0 Z"
                            id="Shape"
                        />
                        <path
                            d="M128,64 L128,128 L64,128 C99.346224,128 128,99.346224 128,64 Z"
                            id="Shape"
                        />
                    </g>
                    <path
                        d="M18.783 19.076 28.014 30.275C15.319 43.253 13.275 57.263 13.272 66.936 15.504 100.519 43.258 113.609 65.122 113.504 88.697 113.391 114.178 97.061 114.58 64.93 115.303 56.987 113.024 45.217 100.208 29.935L108.861 19.28C120.509 30.872 128 46.638 128 64.369 128 99.715 99.346 128.369 64 128.369 28.654 128.369 0 99.715 0 64.369 0 46.676 7.179 30.661 18.783 19.076Z"
                        id="semiCircle"
                        fill="url(#linearGradient-1)"
                        fillRule="nonzero"
                    />
                    <g id="emojis" ref={emojisRef}></g>
                    <text
                        fill={textColor}
                        fontWeight="600"
                        fontSize="14px"
                        fontFamily="Arial, Helvetica, sans-serif">
                        <textPath
                            ref={textRef}
                            xlinkHref="#curvedText"
                            startOffset="25%"
                            textAnchor="middle">
                            {text}
                        </textPath>
                    </text>
                    <image ref={flagImgRef} width="16" height="16" />
                </g>
            </g>
        </svg>
    )
}

export default SVGTemplate
