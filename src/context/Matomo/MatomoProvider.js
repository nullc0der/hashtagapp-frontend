import React from 'react'

import MatomoContext from './MatomoContext'

class MatomoProvider extends React.Component {
    render() {
        return (
            <MatomoContext.Provider value={this.props.value}>
                {this.props.children}
            </MatomoContext.Provider>
        )
    }
}

export default MatomoProvider
