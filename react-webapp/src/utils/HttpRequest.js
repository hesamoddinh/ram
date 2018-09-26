import {Component} from 'react'
import axios from 'axios'
import Security from './Security'
import cfg from '../Config'

// const qs = require('qs')

let instance = axios.create()
instance.defaults.headers['Content-Type'] = 'application/json; charset=utf-8'

class HttpRequest extends Component {
	static post (url, params = {}, config = {}) {
		const backEnd = cfg.api[localStorage.getItem('org')] || cfg.api.default

		config.headers = {'Authorization': 'Bearer ' + localStorage.getItem('token')}

		let urlParams = new URLSearchParams()
		for (let k in params) urlParams.append(k, params[k])

		return instance.post(backEnd + url, params, config)
			.then(payload => {
				if (payload.status !== 200 || (!payload.data.ok && !payload.data.success && !payload.data.transaction)) {
					return Promise.reject({errorCode: payload.data.errorCode, msg: payload.data.msg})
				}
				return payload.data
			})
			.catch(error => {
				if (error.response) {
					if (error.response.status === 401) {
						return Security.signout()
					}
					return Promise.reject(error.response)
				} else if (error) {
					if (error === 401) {
						return Security.signout()
					}
					return Promise.reject(error)
				} else {
					return Promise.reject(400)
				}
			})
	}

	static delete (url) {
		const backEnd = cfg.api[localStorage.getItem('org')] || cfg.api.default

		return instance.delete(backEnd + url, {
			withCredentials: true
		})
			.then(payload => {
				return payload
			})
			.catch(error => {
				if (error.response) {
					if (error.response.status === 401) {
						Security.signout()
					}
					return Promise.reject(error.response.status)
				} else if (error) {
					if (error === 401) {
						Security.signout()
					}
					return Promise.reject(error)
				} else {
					return Promise.reject(400)
				}
			})
	}

	static get (url, params) {
		const backEnd = cfg.api[localStorage.getItem('org')] || cfg.api.default
		let config = {}
		config.headers = {'Authorization': 'Bearer ' + localStorage.getItem('token')}
		let str = ''
		Object.keys(params).map((key, index) => {
			if (params[key] instanceof Array) {
				str += `${key}=[`
				params[key].map(e => {
					str += `"${e}",`
				})
				str = str.slice(0, -1)
				str += `]`
			} else {
				str += `${key}=${params[key]}`
			}
			str += `&`
		})
		str = str.slice(0, -1)
		return instance.get(backEnd + url + `?${str}`, {
			// 'params': params,
			...config
			// 'paramsSerializer': function(params) {
			//     return qs.stringify(params, { indices: false })
			// },
		})
			.then(payload => {
				if ((payload.status !== 304 && payload.status !== 200) || (payload.data.ok === false)) {
					return Promise.reject({errorCode: payload.data.errorCode, msg: payload.data.msg})
				}
				return payload.data
			})
			.catch(error => {
				if (error.response) {
					if (error.response.status === 401) {
						Security.signout()
					}
					return Promise.reject(error.response.data)
				} else if (error) {
					if (error === 401) {
						Security.signout()
					}
					return Promise.reject(error)
				} else {
					return Promise.reject(400)
				}
			})
	}
}

export default HttpRequest

