import {Component} from 'react'
import ChaincodeUtil from '../utils/ChaincodeUtil'
import config from '../Config'
import HttpRequest from '../utils/HttpRequest'

class AuthService extends Component {
	static getToken(username) {
		return HttpRequest.post('/users', {username})
			.then(response => {
				localStorage.setItem('token', response.token)
				return response.token
			})
	}

	static register(username, passwordHash) {
		// TODO HardCoded org
		let args = [username, passwordHash, 'a']
		let func = 'registerUser'
		return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers['a'], func, args)
			.then(response => {
				const user = response.result
				localStorage.setItem('balance', user.balance)
				localStorage.setItem('blocked', user.blocked)
				localStorage.setItem('confirmed', user.confirmed)
				localStorage.setItem('org', user.org)
				localStorage.setItem('auth', 'true')
				localStorage.setItem('username', username)
				localStorage.setItem('passwordHash', passwordHash)
				return response
			})
	}

	static login(username, passwordHash) {
		let args = [username, passwordHash]
		let func = 'loginUser'
		// TODO HardCoded org
		return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers['a'], func, args)
			.then(response => {
				const user = response.result
				// const txId = response.transaction
				localStorage.setItem('balance', user.balance)
				localStorage.setItem('blocked', user.blocked)
				localStorage.setItem('confirmed', user.confirmed)
				localStorage.setItem('org', user.org)
				localStorage.setItem('auth', 'true')
				localStorage.setItem('username', username)
				localStorage.setItem('passwordHash', passwordHash)
				return response
			})
	}
}

export default AuthService
