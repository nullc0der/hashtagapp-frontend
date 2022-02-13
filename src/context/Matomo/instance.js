import MatomoTracker from '@datapunt/matomo-tracker-js'

const createMatomoInstance = (userOptions) => new MatomoTracker(userOptions)

export default createMatomoInstance
