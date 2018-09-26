import {Component} from 'react'
import HttpRequest from '../utils/HttpRequest'

class ChaincodeUtil extends Component {
	static invoke(channelID, contractId, peers, fcn, args) {
		let payload = {
			peers: peers,
			fcn: fcn,
			args: args || []
		}
		return HttpRequest.post('/channels/' + channelID + '/chaincodes/' + contractId, payload)
			.then(response => {
				return response
			})
	}

	static query(channelID, contractId, peers, fcn, args) {
		let payload = {
			peer: peers,
			fcn: fcn,
			args: args || []
		}
		return HttpRequest.get('/channels/' + channelID + '/chaincodes/' + contractId, payload)
			.then(response => {
				return response
			})
	}
}

export default ChaincodeUtil
