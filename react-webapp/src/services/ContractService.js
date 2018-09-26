import {Component} from 'react'
import ChaincodeUtil from '../utils/ChaincodeUtil'
import config from '../Config'

class ContractService extends Component {
	static createContract(dstUsername, amount) {
		let args = [localStorage.getItem('username'), localStorage.getItem('passwordHash'), dstUsername, amount.toString()]
		let func = 'createContract'
		return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem('org')], func, args)
			.then(response => {
				return response.transaction
			})
	}

	static queryUnconfirmedContracts() {
		let args = [localStorage.getItem('username'), localStorage.getItem('passwordHash')]
		let func = 'queryUnconfirmedContracts'
		return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem('org')], func, args)
			.then(response => {
				return response.result
			})
	}

	static queryUserContracts() {
		let args = [localStorage.getItem('username'), localStorage.getItem('passwordHash')]
		let func = 'queryUserContracts'
		return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem('org')], func, args)
			.then(response => {
				return response.result
			})
	}

	static confirmContract(id) {
		let args = [localStorage.getItem('username'), localStorage.getItem('passwordHash'), id]
		let func = 'confirmContract'
		return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem('org')], func, args)
			.then(response => {
				return response.transaction
			})
	}

	static rejectContract(id) {
		let args = [localStorage.getItem('username'), localStorage.getItem('passwordHash'), id]
		let func = 'rejectContract'
		return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem('org')], func, args)
			.then(response => {
				return response.transaction
			})
	}
}

export default ContractService
