import {Component} from 'react'
import ChaincodeUtil from '../utils/ChaincodeUtil'
import config from '../Config'

class DepositService extends Component {

	static getActiveAccounts() {
		let args = [localStorage.getItem('username'), localStorage.getItem('passwordHash')]
		let func = 'queryActiveDepositAccounts'
		return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem('org')], func, args)
			.then(response => {
				const accounts = response.result
				// const txId = response.transaction
				return accounts
			})
	}

	static deposit(account, amount) {
		let args = [localStorage.getItem('username'), localStorage.getItem('passwordHash'), account, amount]
		let func = 'deposit'
		return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem('org')], func, args)
			.then(response => {
				// const accounts = response.result
				const txId = response.transaction
				return txId
			})
	}

	static payProfits(account, profitRate = '') {
		let args = [localStorage.getItem('username'), localStorage.getItem('passwordHash'), account, profitRate.toString()]
		let func = 'payProfits'
		return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem('org')], func, args)
			.then(response => {
				const result = response.result
				// const txId = response.transaction
				return result
			})
	}

	static calculateProfits(account, profitRate = '') {
		let args = [localStorage.getItem('username'), localStorage.getItem('passwordHash'), account, profitRate.toString()]
		let func = 'calculateProfits'
		return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem('org')], func, args)
			.then(response => {
				return response.result
			})
	}

	static queryUserDeposits() {
		let args = [localStorage.getItem('username'), localStorage.getItem('passwordHash')]
		let func = 'queryUserDeposits'
		return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem('org')], func, args)
			.then(response => {
				return response.result
			})
	}

}

export default DepositService
