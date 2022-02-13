import { jsonAPI, formAPI } from './base'

export const fetchProfileImageURL = (provider, uid) => {
    const url = `/hashtag/downloadsocialimage?provider=${provider}&uid=${uid}`
    return jsonAPI((api) => api.get(url))
}

export const uploadProfileImage = (provider, photo, uid) => {
    const url = '/hashtag/uploadimage/'
    const data = new FormData()
    data.append('provider', provider)
    data.append('photo', photo)
    data.append('uid', uid)
    return formAPI((api) => api.post(url, data))
}

export const getNonExistentPhoto = () => {
    const url = '/hashtag/getnonexistentphoto/'
    return formAPI((api) => api.get(url))
}
