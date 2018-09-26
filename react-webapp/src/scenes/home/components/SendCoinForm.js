import React, {Component} from 'react'
import {Form, Header, Message, Segment} from 'semantic-ui-react'
import {injectIntl} from 'react-intl'
import UserService from '../../../services/UserService'
import CoinService from '../../../services/CoinService'

class SendCoinForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			users: [],
			usersLoading: false,
			submitting: false
		}
		this.eventEmitter = props.eventEmitter
	}

	onChangeUser = (e, {value}) => this.setState({username: value})

	onChangeAmount = (e, {value}) => this.setState({amount: value})

	getUsers = () => {
		this.setState({usersLoading: true})
		UserService.queryActiveUsers()
			.then(payload => {
				let users = payload.filter(user => {
					return localStorage.getItem('username') !== user.Record.username
				}).map(user => {
					const rec = user.Record
					return {text: rec.username, key: rec.username, value: rec.username}
				})
				this.setState({users, usersLoading: false})
			})
			.catch(err => {
				this.setState({usersLoading: false})
			})
	}

	sendCoin = () => {
		this.setState({submitting: true, error: false, success: false})
		CoinService.transferCoin(this.state.username, this.state.amount)
			.then(payload => {
				this.setState({submitting: false, success: true})
				this.eventEmitter.emit('reloadBalance', {}, false)
				this.eventEmitter.emit('reloadLogs', {}, false)
			})
			.catch(err => {
				this.setState({submitting: false, error: err.msg})
			})
	}

	componentDidMount = () => {
		this.getUsers()
	}

	render() {
		return (
			<Segment color={'violet'} padded>
				<Header as='h3' content={this.props.intl.formatMessage({id: 'sendCoinForm.title'})}/>
				<Form success={!!this.state.success} error={!!this.state.error} onSubmit={this.sendCoin}>
					<Form.Group widths='equal'>
						<Form.Input type={'number'} fluid
						            min={1}
						            onChange={this.onChangeAmount}
						            label={this.props.intl.formatMessage({id: 'sendCoinForm.amount'})}/>
						<Form.Select loading={this.state.usersLoading} fluid
						             onChange={this.onChangeUser}
						             label={this.props.intl.formatMessage({id: 'sendCoinForm.user'})}
						             options={this.state.users}/>
					</Form.Group>
					<Form.Button fluid loading={this.state.submitting}
					             disabled={!this.state.username || !this.state.amount}
					             color={'violet'}>{this.props.intl.formatMessage({id: 'sendCoinForm.submit'})}</Form.Button>
					<Message style={{direction: 'ltr', textAlign: 'left'}} error content={this.state.error}/>
					<Message style={{direction: 'ltr', textAlign: 'left'}} success
					         content={'Balance transferred successfully.'}/>
				</Form>
			</Segment>
		)
	}
}

export default SendCoinForm = injectIntl(SendCoinForm)
