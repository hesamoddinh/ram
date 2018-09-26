import {Component} from 'react'
import ChaincodeUtil from '../utils/ChaincodeUtil'
import config from '../Config'

class CoinService extends Component {
	static transferCoin(dstUsername, amount) {
		let args = [localStorage.getItem('username'), localStorage.getItem('passwordHash'), localStorage.getItem('username'), dstUsername, amount]
		let func = 'transferMoney'
		return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem('org')], func, args)
			.then(response => {
				const user = response.result
				// const txId = response.transaction
				return user
			})
	}

	static generateCoin(dstUsername, amount) {
		let args = [localStorage.getItem('username'), localStorage.getItem('passwordHash'), dstUsername, amount]
		let func = 'generateMoney'
		return ChaincodeUtil.invoke(config.channel, config.chaincode, config.orgsPeers[localStorage.getItem('org')], func, args)
			.then(response => {
				const user = response.result
				// const txId = response.transaction
				return user
			})
	}
}

export default CoinService
