import { create } from 'apisauce'

const api = create({
    baseURL: process.env.REACT_APP_API_ROOT,
    headers: {
        Accept: 'application/json'
    }
})

const rejectIfResponseNotOK = response => {
    return response.ok
        ? Promise.resolve(response)
        : Promise.reject(response.data)
}

export const formAPI = function(createRequestPromise) {
    if (typeof createRequestPromise !== 'function') {
        throw new Error('Callback should be a function')
    }

    const API = api

    API.setHeader('Content-Type', 'multipart/form-data')

    return Promise.resolve(API)
        .then(createRequestPromise)
        .then(response => {
            return rejectIfResponseNotOK(response)
        })
}

export const jsonAPI = function(createRequestPromise) {
    if (typeof createRequestPromise !== 'function') {
        throw new Error('Callback should be a function')
    }

    const API = api

    API.setHeader('Content-Type', 'application/json')

    return Promise.resolve(API)
        .then(createRequestPromise)
        .then(response => {
            return rejectIfResponseNotOK(response)
        })
}

export default api
