import React from 'react'
import classnames from 'classnames'

import Dialog from 'components/Dialog'

import s from './Footer.module.scss'

class Footer extends React.Component {
    state = {
        isDisclaimerDialogOpen: false,
    }

    toggleDisclaimerDialog = () => {
        this.setState({
            isDisclaimerDialogOpen: !this.state.isDisclaimerDialogOpen,
        })
    }

    render() {
        const { className } = this.props
        const cx = classnames(s.container, className)

        return (
            <div className={cx}>
                <button
                    className="btn btn-link"
                    onClick={this.toggleDisclaimerDialog}>
                    Disclaimer
                </button>
                <Dialog
                    isOpen={this.state.isDisclaimerDialogOpen}
                    title="Disclaimer"
                    className={s.container}
                    onRequestClose={this.toggleDisclaimerDialog}>
                    <p>
                        The hashtag app was created as a feature for individuals
                        to update their profile images to the banner of their
                        choosing in support of basic income advocacy. The
                        hashtag app includes a variety of menu options that
                        allows for individual choice and in the future we may
                        add any public figure that openly supports the basic
                        income movement. Baza Foundation, as an organization,
                        does not endorse any one specific candidate.
                    </p>
                </Dialog>
            </div>
        )
    }
}

export default Footer
