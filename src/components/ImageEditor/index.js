import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Cropper from 'cropperjs'
import uniqueId from 'lodash/uniqueId'

import Dialog from 'components/Dialog'
import { UncontrolledTooltip } from 'reactstrap'

import s from './ImageEditor.module.scss'

function getRoundedCanvas(sourceCanvas) {
    var canvas = document.createElement('canvas')
    var context = canvas.getContext('2d')
    var width = sourceCanvas.width
    var height = sourceCanvas.height
    canvas.width = width
    canvas.height = height
    context.imageSmoothingEnabled = true
    context.drawImage(sourceCanvas, 0, 0, width, height)
    context.globalCompositeOperation = 'destination-in'
    context.beginPath()
    context.arc(
        width / 2,
        height / 2,
        Math.min(width, height) / 2,
        0,
        2 * Math.PI,
        true
    )
    context.fill()
    return canvas
}

const CropperAction = ({ icon, tip, ...others }) => {
    const id = uniqueId('cropper-action-')
    return (
        <div id={id} className="cropper-action btn btn-dark" {...others}>
            <i className={icon} />
            <UncontrolledTooltip
                placement="top"
                target={id}
                delay={0}
                innerClassName="cropper-tooltip-inner"
                arrowClassName="cropper-tooltip-arrow">
                {tip}
            </UncontrolledTooltip>
        </div>
    )
}

export default class EditImage extends Component {
    static propTypes = {
        cropRounded: PropTypes.bool,
        onRequestClose: PropTypes.func.isRequired,
        onEditDone: PropTypes.func.isRequired,
        src: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
    }

    static defaultProps = {
        cropRounded: false
    }

    state = {
        editedImage: '',
        imgReady: false
    }

    // componentDidMount = () => {
    //     this.cropper = new Cropper(this.img, this.getCropperOptions())
    // }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.imgReady !== this.state.imgReady && this.state.imgReady) {
            this.cropper = new Cropper(this.img, this.getCropperOptions())
        }
    }

    componentWillUnmount = () => {
        this.cropper.destroy()
    }

    getCropperOptions = () => {
        return {
            initialAspectRatio: 1,
            aspectRatio: 1,
            ready: this.beginCrop,
            background: false
        }
    }

    beginCrop = () => {
        console.log('can crop now')
    }

    onEditDone = () => {
        const { cropRounded } = this.props
        const croppedCanvas = this.cropper.getCroppedCanvas({
            maxWidth: 2000,
            maxHeight: 2000
        })

        const targetCanvas = cropRounded
            ? getRoundedCanvas(croppedCanvas)
            : croppedCanvas

        const image = targetCanvas.toDataURL('image/png')

        this.props.onEditDone(image)
    }

    setImageReady = () => {
        this.setState({
            imgReady: true
        })
    }

    setDragMove = () => this.cropper.setDragMode('move')
    setDragCrop = () => this.cropper.setDragMode('crop')
    zoomIn = () => this.cropper.zoom(0.1)
    zoomOut = () => this.cropper.zoom(-0.1)
    moveLeft = () => this.cropper.move(-10, 0)
    moveRight = () => this.cropper.move(10, 0)
    moveUp = () => this.cropper.move(0, -10)
    moveDown = () => this.cropper.move(0, 10)
    rotateLeft = () => this.cropper.rotate(-45)
    rotateRight = () => this.cropper.rotate(45)
    flipHorizontal = () => this.cropper.scaleX(-1)
    flipVertical = () => this.cropper.scaleY(-1)

    render() {
        const { src } = this.props

        const _footer = (
            <React.Fragment>
                <div className="cropper-actions">
                    <div className="btn-group btn-group-sm">
                        <CropperAction
                            icon="fas fa-arrows-alt"
                            tip="Move on Drag"
                            onClick={this.setDragMove}
                        />
                        <CropperAction
                            icon="fas fa-crop"
                            tip="Crop on Drag"
                            onClick={this.setDragCrop}
                        />
                    </div>
                    <div className="btn-group btn-group-sm">
                        <CropperAction
                            icon="fas fa-search-plus"
                            tip="Zoom In"
                            onClick={this.zoomIn}
                        />
                        <CropperAction
                            icon="fas fa-search-minus"
                            tip="Zoom Out"
                            onClick={this.zoomOut}
                        />
                    </div>
                    <div className="btn-group btn-group-sm">
                        <CropperAction
                            icon="fas fa-arrow-left"
                            tip="Move Left"
                            onClick={this.moveLeft}
                        />
                        <CropperAction
                            icon="fas fa-arrow-right"
                            tip="Move Right"
                            onClick={this.moveRight}
                        />
                        <CropperAction
                            icon="fas fa-arrow-up"
                            tip="Move Up"
                            onClick={this.moveUp}
                        />
                        <CropperAction
                            icon="fas fa-arrow-down"
                            tip="Move Down"
                            onClick={this.moveDown}
                        />
                    </div>
                    <div className="btn-group btn-group-sm">
                        <CropperAction
                            icon="fas fa-undo"
                            tip="Rotate Left"
                            onClick={this.rotateLeft}
                        />
                        <CropperAction
                            icon="fas fa-redo"
                            tip="Rotate Right"
                            onClick={this.rotateRight}
                        />
                    </div>
                    <div className="btn-group btn-group-sm">
                        <CropperAction
                            icon="fas fa-arrows-alt-h"
                            tip="Flip Horizontal"
                            onClick={this.flipHorizontal}
                        />
                        <CropperAction
                            icon="fas fa-arrows-alt-v"
                            tip="Flip Vertical"
                            onClick={this.flipVertical}
                        />
                    </div>
                </div>
                <div className="flex-1" />
                <div className="flex-horizontal mt-lg-0 mt-1 j-around">
                    <div
                        className="btn btn-light btn-cancel"
                        onClick={this.props.onRequestClose}>
                        Cancel
                    </div>
                    <div
                        onClick={this.onEditDone}
                        className="btn btn-dark btn-done">
                        Done
                    </div>
                </div>
            </React.Fragment>
        )

        return (
            <Dialog
                isOpen
                title="Edit Image"
                className={s.container}
                onRequestClose={this.props.onRequestClose}
                footer={_footer}>
                <div className="edit-image-inner">
                    <img
                        alt=""
                        ref={node => (this.img = node)}
                        className="image-to-edit"
                        src={src}
                        onLoad={this.setImageReady}
                    />
                </div>
            </Dialog>
        )
    }
}
