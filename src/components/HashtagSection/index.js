import React, { Component } from 'react'
import classnames from 'classnames'
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap'

import ColorPicker from 'components/ColorPicker'
import CircularImage from 'components/CircularImage'
import ImageEditor from 'components/ImageEditor'

import { fetchProfileImageURL, uploadProfileImage } from 'api/hashtag'

import s from './HashtagSection.module.scss'
import SVGTemplate from './SVGTemplate.js'

function getScalingFactors(context, image, provider) {
    var x
    var y
    if (provider === 'facebook' || provider === 'manual') {
        x = 600
        y = 600
    } else if (provider === 'twitter') {
        x = 400
        y = 400
    } else {
        throw new Error(
            `Unknown provider. Cannot get scaling: ` + provider.name
        )
    }

    var scaleX = x / image.naturalWidth
    var scaleY = y / image.naturalHeight

    return { scaleX, scaleY }
}

function getFinalImagePNG(provider) {
    const svg = document.getElementById('final-image-svg')
    const svgStr = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = 128
    canvas.height = 128

    const img = new Image()

    return new Promise((resolve, reject) => {
        var url = `data:image/svg+xml;base64,${btoa(
            unescape(encodeURIComponent(svgStr))
        )}`
        img.onload = function() {
            let { scaleX, scaleY } = getScalingFactors(ctx, img, provider)
            canvas.width = canvas.width * scaleX
            canvas.height = canvas.height * scaleY
            ctx.scale(scaleX, scaleY) // Scale canvas
            ctx.drawImage(img, 0, 0) // Draw the scaled image
            let finalImage = canvas.toDataURL('image/png')
            resolve(finalImage)
        }

        img.src = url
    })
}

function downloadAs(filename, data) {
    const el = document.createElement('a')
    el.setAttribute('href', data)
    el.setAttribute('download', filename)

    el.style.display = 'none'
    document.body.appendChild(el)

    el.click()

    setTimeout(() => {
        document.body.removeChild(el)
    }, 500)
}

function imageToDataURL(imageSrc) {
    const img = document.createElement('img')
    img.crossOrigin = 'Anonymous'
    const canvas = document.createElement('canvas')

    return new Promise((resolve, reject) => {
        img.onload = function() {
            canvas.height = img.naturalHeight
            canvas.width = img.naturalWidth

            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            resolve(canvas.toDataURL())
        }

        img.onerror = function() {
            reject(new Error('Cannot load image'))
        }

        img.src = imageSrc
    })
}

function dataURLtoBlob(dataURL) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURL.split(',')[1])

    // separate out the mime component
    var mimeString = dataURL
        .split(',')[0]
        .split(':')[1]
        .split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var arrayBuffer = new ArrayBuffer(byteString.length)
    var _ia = new Uint8Array(arrayBuffer)
    for (var i = 0; i < byteString.length; i++) {
        _ia[i] = byteString.charCodeAt(i)
    }

    var dataView = new DataView(arrayBuffer)
    var blob = new Blob([dataView], { type: mimeString })
    return blob
}

class HashtagSection extends Component {
    state = {
        previewImage: '',
        croppedImage: '',
        showCropper: false,
        textColor: '#fff',
        semiCircleColor: '#000',
        showBGColorPicker: false,
        showTextColorPicker: false,
        svgTextDropdownOpen: false,
        svgText: '#BasicIncome'
    }

    componentDidMount = () => {
        const { provider } = this.props
        if (provider !== 'manual') {
            this.getImageFromSocial()
        }
    }

    downloadImage = () => {
        const { croppedImage } = this.state
        if (!croppedImage) {
            return
        }

        getFinalImagePNG(this.props.provider)
            .then(data => {
                downloadAs('hashtag-image.png', data)
            })
            .catch(err => {
                alert(err.message)
            })
    }

    onImageUpload = e => {
        const file = e.target.files[0]
        const reader = new FileReader()

        this.setState({ previewImage: '' })
        reader.onloadend = () => {
            this.setState({ previewImage: reader.result, showCropper: true })
        }

        if (file) {
            reader.readAsDataURL(file)
        } else {
            throw new Error('Cannot read image file')
        }
    }

    getImageFromSocial = () => {
        const { provider, uid } = this.props
        this.setState({ isDownloading: true })

        fetchProfileImageURL(provider, uid)
            .then(response => response.data.url)
            .then(imageToDataURL)
            .then(this.handleImageLoadSuccess)
            .catch(this.handleImageLoadError)
    }

    handleImageLoadSuccess = imageUrl => {
        this.setState({
            isDownloading: false,
            previewImage: imageUrl,
            showCropper: true
        })
    }
    handleImageLoadError = err => {
        this.setState({ isDownloading: false })
    }

    onEditDone = croppedImage => {
        this.setState({ croppedImage }, this.onCropperClose)
    }

    onCropperClose = () => {
        document.querySelector('.input-file[type="file"]').value = ''
        this.setState({ showCropper: false, previewImage: '' })
    }

    onSemiCircleColorChange = color => {
        const c = color.rgb
        const semiCircleColor = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`
        this.setState({ semiCircleColor })
    }

    onTextColorChange = color => {
        const c = color.rgb
        const textColor = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`
        this.setState({ textColor })
    }

    uploadImageToSocial = () => {
        const { provider, uid } = this.props
        const { croppedImage } = this.state
        if (!croppedImage) {
            return
        }
        this.setState({ isUploading: true })
        getFinalImagePNG(provider)
            .then(dataUrl =>
                uploadProfileImage(provider, dataURLtoBlob(dataUrl), uid)
            )
            .then(response => {
                this.setState({ isUploading: false })
                provider === 'facebook'
                    ? this.openFBShare(response.data.url)
                    : this.openSuccessDialog(provider)
            })
            .catch(err => {
                this.setState({ isUploading: false })
                alert(err.message)
            })
    }

    openFBShare = href => {
        window.FB.ui(
            {
                method: 'share',
                href
            },
            () => this.openSuccessDialog('facebook')
        )
    }

    openSuccessDialog = provider => {
        const message =
            provider === 'facebook'
                ? 'Successfully shared image on your wall'
                : 'Successfully set image as profile picture'
        alert(message)
    }

    toggleSVGTextDropdown = () => {
        this.setState({
            svgTextDropdownOpen: !this.state.svgTextDropdownOpen
        })
    }

    onChangeSVGText = text => {
        this.setState({
            svgText: text
        })
    }

    render() {
        const { className, uid, provider, resetLogin } = this.props
        const cx = classnames(
            s.container,
            className,
            'container',
            'text-center'
        )
        const {
            previewImage,
            showCropper,
            croppedImage,
            textColor,
            semiCircleColor,
            showTextColorPicker,
            showBGColorPicker,
            isDownloading,
            isUploading,
            svgTextDropdownOpen,
            svgText
        } = this.state

        const hashTags = [
            '#Yang2020',
            '#UBI',
            '#IncomeMarch',
            '#UniversalBasicIncome',
            '#FreedomDividend',
            '#CitizensDividend',
            '#LivableIncome',
            '#GuaranteedLivableIncome',
            '#SocialIncome',
            '#CitizensIncome',
            '#BIG',
            '#BasicIncomeGuarantee'
        ]

        return (
            <div className={cx}>
                <h2 className="app-name"> HASHTAG APP</h2>
                <div className="actions mt-2 mt-md-4">
                    <Dropdown
                        isOpen={svgTextDropdownOpen}
                        toggle={this.toggleSVGTextDropdown}>
                        <DropdownToggle
                            caret
                            className="dropdown-toggle btn btn-light">
                            {svgText}
                        </DropdownToggle>
                        <DropdownMenu right>
                            {/* This should be always the first item */}
                            <DropdownItem
                                onClick={() =>
                                    this.onChangeSVGText('#BasicIncome')
                                }>
                                #BasicIncome
                            </DropdownItem>
                            {hashTags.sort().map((x, i) => (
                                <DropdownItem
                                    key={i}
                                    onClick={() => this.onChangeSVGText(x)}>
                                    {x}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                {showCropper && (
                    <ImageEditor
                        cropRounded
                        src={previewImage}
                        onEditDone={this.onEditDone}
                        onRequestClose={this.onCropperClose}
                    />
                )}
                <div className="preview-section mt-2">
                    <CircularImage size={128} src={croppedImage} />
                    <div className="arrow">
                        <i className="fa fa-arrow-right" />
                    </div>
                    <SVGTemplate
                        id="final-image-svg"
                        text={svgText}
                        textColor={textColor}
                        semiCircleColor={semiCircleColor}
                        imageData={croppedImage}
                    />
                </div>
                <div className="actions mt-2">
                    <div className="btn btn-light btn-upload-local">
                        Upload new image
                        <i className="fas fa-cloud-upload-alt" />
                        <input
                            className="input-file"
                            type="file"
                            accept="image/*"
                            name="localImage"
                            onChange={this.onImageUpload}
                        />
                    </div>
                    {!!uid && (
                        <div
                            className="btn btn-light mt-1 mt-md-0"
                            onClick={() =>
                                this.setState({ showBGColorPicker: true })
                            }>
                            Background Color
                            <i className="fas fa-eye-dropper" />
                            {showBGColorPicker && (
                                <ColorPicker
                                    color={semiCircleColor}
                                    onChange={this.onSemiCircleColorChange}
                                    onRequestClose={() =>
                                        this.setState({
                                            showBGColorPicker: false
                                        })
                                    }
                                />
                            )}
                        </div>
                    )}
                </div>
                {!!uid && (
                    <div className="actions mt-1 mt-md-2">
                        <div
                            className="btn btn-light mt-1 mt-md-0"
                            onClick={this.getImageFromSocial}>
                            Use from {provider}
                            {isDownloading ? (
                                <i
                                    className={`fas fa-spinner fa-pulse fa-fw`}
                                />
                            ) : (
                                <i className={`fab fa-${provider}`} />
                            )}
                        </div>
                        <div
                            className="btn btn-light mt-1 mt-md-0"
                            onClick={() =>
                                this.setState({ showTextColorPicker: true })
                            }>
                            Text Color
                            <i className="fas fa-eye-dropper" />
                            {showTextColorPicker && (
                                <ColorPicker
                                    color={textColor}
                                    onChange={this.onTextColorChange}
                                    onRequestClose={() =>
                                        this.setState({
                                            showTextColorPicker: false
                                        })
                                    }
                                />
                            )}
                        </div>
                    </div>
                )}
                {!uid && (
                    <React.Fragment>
                        <div className="actions mt-1 mt-md-2">
                            <div
                                className="btn btn-light mt-1 mt-md-0"
                                onClick={() =>
                                    this.setState({ showBGColorPicker: true })
                                }>
                                Background Color
                                <i className="fas fa-eye-dropper" />
                                {showBGColorPicker && (
                                    <ColorPicker
                                        color={semiCircleColor}
                                        onChange={this.onSemiCircleColorChange}
                                        onRequestClose={() =>
                                            this.setState({
                                                showBGColorPicker: false
                                            })
                                        }
                                    />
                                )}
                            </div>
                        </div>
                        <div className="actions mt-1 mt-md-2">
                            <div
                                className="btn btn-light"
                                onClick={() =>
                                    this.setState({ showTextColorPicker: true })
                                }>
                                Text Color
                                <i className="fas fa-eye-dropper" />
                                {showTextColorPicker && (
                                    <ColorPicker
                                        color={textColor}
                                        onChange={this.onTextColorChange}
                                        onRequestClose={() =>
                                            this.setState({
                                                showTextColorPicker: false
                                            })
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </React.Fragment>
                )}
                <div className="final-actions actions mt-1 mt-md-2">
                    <div
                        className="btn btn-dark btn-download"
                        onClick={this.downloadImage}>
                        Download Image
                        <i className="fas fa-arrow-down" />
                    </div>
                    {!!uid && (
                        <div
                            className={`btn btn-dark btn-upload-social mt-1 mt-md-0`}
                            onClick={this.uploadImageToSocial}>
                            Upload to {provider}
                            <i className="fas fa-arrow-up" />
                            {isUploading && (
                                <i
                                    className={`fas fa-spinner fa-pulse fa-fw`}
                                />
                            )}
                        </div>
                    )}
                </div>
                <div className="final-actions actions mt-2">
                    <div
                        className="btn btn-primary btn-start-over"
                        onClick={resetLogin}>
                        Start Over
                    </div>
                </div>
            </div>
        )
    }
}

export default HashtagSection
