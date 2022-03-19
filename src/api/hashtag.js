import { jsonAPI } from './base'

export const fetchProfileImageURL = (provider, uid) => {
    const url = `/hashtag/downloadsocialimage?provider=${provider}&uid=${uid}`
    return jsonAPI((api) => api.get(url))
}

export const uploadProfileImage = (provider, svgStr, uid) => {
    const url = '/hashtag/uploadimage/'
    return jsonAPI((api) =>
        api.post(url, { provider, uid, svg: window.encodeURIComponent(svgStr) })
    )
}

export const getNonExistentPhoto = () => {
    const url = '/hashtag/getnonexistentphoto/'
    return jsonAPI((api) => api.get(url))
}

export const downloadImage = (svgStr) => {
    const url = '/hashtag/downloadimage/'
    return jsonAPI((api) =>
        api.post(url, { svg: window.encodeURIComponent(svgStr) })
    )
}
