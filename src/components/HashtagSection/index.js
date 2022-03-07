import React, { Component } from 'react'
import classnames from 'classnames'
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap'

import ColorPicker from 'components/ColorPicker'
import CircularImage from 'components/CircularImage'
import ImageEditor from 'components/ImageEditor'
import { MatomoContext } from 'context/Matomo'
import EmojiPicker from 'components/EmojiPicker'

import { fetchProfileImageURL, uploadProfileImage } from 'api/hashtag'

import s from './HashtagSection.module.scss'
import SVGTemplate from './SVGTemplate.js'
import { HASHTAGS } from './hashtags'

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
        img.onload = function () {
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
        img.onload = function () {
            canvas.height = img.naturalHeight
            canvas.width = img.naturalWidth

            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0)
            resolve(canvas.toDataURL())
        }

        img.onerror = function () {
            reject(new Error('Cannot load image'))
        }

        img.src = imageSrc
    })
}

function dataURLtoBlob(dataURL) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURL.split(',')[1])

    // separate out the mime component
    var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]

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
    static contextType = MatomoContext

    state = {
        previewImage: '',
        croppedImage: '',
        showCropper: false,
        textColor: '#fff',
        semiCircleColor: '#000',
        showBGColorPicker: false,
        showTextColorPicker: false,
        svgTextDropdownOpen: false,
        selectedSvgText: '#BasicIncome',
        svgText: '#BasicIncome',
        showEmojiPicker: false,
        selectedEmojis: [],
        selectedCountry: null,
        showCountryPicker: false,
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
            .then((data) => {
                this.context.trackEvent({
                    category: 'HashtagImage',
                    action: 'Download',
                    name: '',
                })
                downloadAs('hashtag-image.png', data)
            })
            .catch((err) => {
                alert(err.message)
            })
    }

    onImageUpload = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()

        this.setState({ previewImage: '' })
        reader.onloadend = () => {
            this.context.trackEvent({
                category: 'HashtagImage',
                action: 'Manual Upload',
                name: '',
            })
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
            .then((response) => response.data.url)
            .then(imageToDataURL)
            .then(this.handleImageLoadSuccess)
            .catch(this.handleImageLoadError)
    }

    handleImageLoadSuccess = (imageUrl) => {
        this.context.trackEvent({
            category: 'HashtagImage',
            action: 'Load from social',
            name: '',
        })
        this.setState({
            isDownloading: false,
            previewImage: imageUrl,
            showCropper: true,
        })
    }
    handleImageLoadError = (err) => {
        this.setState({ isDownloading: false })
    }

    onEditDone = (croppedImage) => {
        this.setState({ croppedImage }, this.onCropperClose)
    }

    onCropperClose = () => {
        document.querySelector('.input-file[type="file"]').value = ''
        this.context.trackEvent({
            category: 'HashtagImage',
            action: 'Edit dialog close',
            name: '',
        })
        this.setState({ showCropper: false, previewImage: '' })
    }

    onSemiCircleColorChange = (color) => {
        const c = color.rgb
        const semiCircleColor = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`
        this.context.trackEvent({
            category: 'HashtagImage',
            action: 'Circle color changed',
            name: '',
        })
        this.setState({ semiCircleColor })
    }

    onTextColorChange = (color) => {
        const c = color.rgb
        const textColor = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`
        this.context.trackEvent({
            category: 'HashtagImage',
            action: 'Text color changed',
            name: '',
        })
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
            .then((dataUrl) =>
                uploadProfileImage(provider, dataURLtoBlob(dataUrl), uid)
            )
            .then((response) => {
                this.setState({ isUploading: false })
                if (provider === 'facebook') {
                    this.openFBShare(response.data.url)
                } else {
                    this.context.trackEvent({
                        category: 'ProfileImage',
                        action: 'Upload',
                        name: `Twitter username: ${response.data.user} Hashtag image uid: ${response.data.hashtag_image_uid}`,
                    })
                    this.openSuccessDialog(provider)
                }
            })
            .catch((err) => {
                this.setState({ isUploading: false })
                alert(err.message)
            })
    }

    openFBShare = (href) => {
        window.FB.ui(
            {
                method: 'share',
                href,
            },
            () => this.openSuccessDialog('facebook')
        )
    }

    openSuccessDialog = (provider) => {
        const message =
            provider === 'facebook'
                ? 'Successfully shared image on your wall'
                : 'Successfully set image as profile picture'
        alert(message)
    }

    toggleSVGTextDropdown = () => {
        this.setState({
            svgTextDropdownOpen: !this.state.svgTextDropdownOpen,
        })
    }

    onChangeSVGText = (text) => {
        this.context.trackEvent({
            category: 'HashtagImage',
            action: 'Text change',
            name: `${text}`,
        })
        this.setState({
            selectedSvgText: text,
            svgText: text,
            selectedEmojis: [],
            selectedCountry: null,
        })
    }

    addEmojiToSVGText = () => {
        let emojiTexts = ''
        for (const selectedEmoji of this.state.selectedEmojis) {
            emojiTexts += `${selectedEmoji.emoji} `
        }
        let svgText = `${emojiTexts}${this.state.selectedSvgText}`
        if (this.state.selectedCountry) {
            svgText = `${svgText} ${this.state.selectedCountry.emoji}`
        }
        this.setState({
            svgText,
        })
    }

    onEmojiSelect = (_, emojiObject) => {
        this.context.trackEvent({
            category: 'HashtagImage',
            action: 'Added Emoji',
            name: '',
        })
        const selectedEmojis = this.state.selectedEmojis
        if (selectedEmojis.length < 3) {
            selectedEmojis.push(emojiObject)
        } else {
            selectedEmojis[2] = emojiObject
        }
        this.setState(
            {
                showEmojiPicker: false,
                selectedEmojis,
            },
            () => this.addEmojiToSVGText()
        )
    }

    onCountrySelect = (_, emojiObject) => {
        this.context.trackEvent({
            category: 'HashtagImage',
            action: 'Added Country Flag',
            name: '',
        })
        let svgText = this.state.svgText
        if (this.state.selectedCountry) {
            svgText = svgText.slice(0, svgText.length - 4)
            svgText = `${svgText} ${emojiObject.emoji}`
        } else {
            svgText = `${svgText} ${emojiObject.emoji}`
        }
        this.setState({
            svgText,
            showCountryPicker: false,
            selectedCountry: emojiObject,
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
            selectedSvgText,
            svgText,
            showEmojiPicker,
            showCountryPicker,
        } = this.state

        return (
            <div className={cx}>
                <h2 className="app-name">UBI HASHTAG APP</h2>
                <div className="actions mt-2 mt-md-4">
                    <Dropdown
                        isOpen={svgTextDropdownOpen}
                        toggle={this.toggleSVGTextDropdown}>
                        <DropdownToggle
                            caret
                            className="dropdown-toggle btn btn-light">
                            {selectedSvgText}
                        </DropdownToggle>
                        <DropdownMenu right>
                            {/* This should be always the first item */}
                            <DropdownItem
                                onClick={() =>
                                    this.onChangeSVGText('#BasicIncome')
                                }>
                                #BasicIncome
                            </DropdownItem>
                            {HASHTAGS.sort().map((x, i) => (
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
                                            showBGColorPicker: false,
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
                                            showTextColorPicker: false,
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
                                                showBGColorPicker: false,
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
                                                showTextColorPicker: false,
                                            })
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </React.Fragment>
                )}
                {!!uid ? (
                    <React.Fragment>
                        <div className="actions mt-1 mt-md-2">
                            <div
                                className="btn btn-light"
                                onClick={() =>
                                    this.setState({ showEmojiPicker: true })
                                }>
                                Add emoji
                                <i className="far fa-smile" />
                            </div>
                            {showEmojiPicker && (
                                <EmojiPicker
                                    onEmojiClick={this.onEmojiSelect}
                                    onClosePicker={() =>
                                        this.setState({
                                            showEmojiPicker: false,
                                        })
                                    }
                                />
                            )}
                            <div
                                className="btn btn-light mt-1 mt-md-0"
                                onClick={() =>
                                    this.setState({ showCountryPicker: true })
                                }>
                                Add country flag
                                <i className="fas fa-flag" />
                            </div>
                            {showCountryPicker && (
                                <EmojiPicker
                                    onEmojiClick={this.onCountrySelect}
                                    flagsOnly={true}
                                    onClosePicker={() =>
                                        this.setState({
                                            showCountryPicker: false,
                                        })
                                    }
                                />
                            )}
                        </div>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <div className="actions mt-1 mt-md-2">
                            <div
                                className="btn btn-light"
                                onClick={() =>
                                    this.setState({ showEmojiPicker: true })
                                }>
                                Add emoji
                                <i className="far fa-smile" />
                            </div>
                            {showEmojiPicker && (
                                <EmojiPicker
                                    onEmojiClick={this.onEmojiSelect}
                                    onClosePicker={() =>
                                        this.setState({
                                            showEmojiPicker: false,
                                        })
                                    }
                                />
                            )}
                        </div>
                        <div className="actions mt-1 mt-md-2">
                            <div
                                className="btn btn-light"
                                onClick={() =>
                                    this.setState({ showCountryPicker: true })
                                }>
                                Add country flag
                                <i className="fas fa-flag" />
                            </div>
                            {showCountryPicker && (
                                <EmojiPicker
                                    onEmojiClick={this.onCountrySelect}
                                    flagsOnly={true}
                                    onClosePicker={() =>
                                        this.setState({
                                            showCountryPicker: false,
                                        })
                                    }
                                />
                            )}
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
