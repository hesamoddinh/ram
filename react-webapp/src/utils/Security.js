import {Component} from 'react'
import HttpRequest from './HttpRequest'

class Security extends Component {
	static authenticate (params) {
		return HttpRequest.post('/login', params)
			.then(payload => {
				sessionStorage.setItem('Auth', 'true')
				localStorage.setItem('locale', 'fa')
				localStorage.setItem('org', payload.data.org)
				localStorage.setItem('id', payload.data.id)
				return true
			})
	}

	static signout (cb) {
		sessionStorage.setItem('Auth', 'false')
		localStorage.clear()
		return Promise.resolve()
		// setTimeout(cb, 100) // fake async
	}

	static isAuthenticated () {
		return localStorage.getItem('auth') === 'true'
		// return sessionStorage.getItem('Auth') === 'true'
	}

	static isAuthorized (org) {
		if (!org) return true
		return org === localStorage.getItem('org')
		// return roles.indexOf(localStorage.getItem('role')) > -1
	}
}

export default Security
