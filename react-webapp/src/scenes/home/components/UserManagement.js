import React, {Component} from 'react'
import {Button, Header, Segment, Table} from 'semantic-ui-react'
import {FormattedMessage, injectIntl} from 'react-intl'
import UserService from '../../../services/UserService'

class UserManagement extends Component {
	constructor(props) {
		super(props)
		this.state = {
			users: [],
			loading: false,
			confirmLoading: '',
			blockLoading: '',
			unBlockLoading: ''
		}
		this.eventEmitter = props.eventEmitter
	}

	getUsers = () => {
		this.setState({loading: true})
		UserService.queryAllUsers()
			.then(payload => {
				let users = payload.map(user => {
					const rec = user.Record
					return {username: rec.username, org: rec.org, blocked: rec.blocked, confirmed: rec.confirmed}
				})
				this.setState({users, loading: false})
			})
			.catch(err => {
				this.setState({loading: false})
			})
	}

	confirmUser = (username) => {
		this.setState({confirmLoading: username})
		UserService.confirmUser(username)
			.then(payload => {
				// user
				this.eventEmitter.emit('reloadLogs', {}, false)
				this.setState({confirmLoading: ''})
				this.getUsers()
			})
			.catch(err => {
				this.setState({confirmLoading: ''})
			})
	}

	blockUser = (username) => {
		this.setState({blockLoading: username})
		UserService.blockUser(username)
			.then(payload => {
				// user
				this.eventEmitter.emit('reloadLogs', {}, false)
				this.setState({blockLoading: ''})
				this.getUsers()
			})
			.catch(err => {
				this.setState({blockLoading: ''})
			})
	}

	unblockUser = (username) => {
		this.setState({unBlockLoading: username})
		UserService.unBlockUser(username)
			.then(payload => {
				// user
				this.eventEmitter.emit('reloadLogs', {}, false)
				this.setState({unBlockLoading: ''})
				this.getUsers()
			})
			.catch(err => {
				this.setState({unBlockLoading: ''})
			})
	}

	componentDidMount = () => {
		this.getUsers()
	}

	render() {
		return (
			<Segment loading={this.state.loading} padded>
				<Header as='h3' content={this.props.intl.formatMessage({id: 'userManagement.title'})}/>
				<Table color={'violet'} textAlign={'center'} striped>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>{this.props.intl.formatMessage({id: 'userManagement.username'})}</Table.HeaderCell>
							<Table.HeaderCell colSpan={3}><FormattedMessage id={'action'}/></Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{this.state.users.map((user, i) => {
							return <Table.Row key={i}>
								<Table.Cell>{user.username}</Table.Cell>
								<Table.Cell><Button loading={this.state.confirmLoading === user.username}
								                    onClick={() => this.confirmUser(user.username)} disabled={user.confirmed === 1}
								                    content={this.props.intl.formatMessage({id: 'userManagement.confirm'})}
								                    color={'violet'}/></Table.Cell>
								<Table.Cell><Button loading={this.state.blockLoading === user.username}
								                    onClick={() => this.blockUser(user.username)} disabled={user.blocked !== 0}
								                    content={this.props.intl.formatMessage({id: 'userManagement.block'})}
								                    color={'violet'}/></Table.Cell>
								<Table.Cell><Button loading={this.state.unBlockLoading === user.username}
								                    onClick={() => this.unblockUser(user.username)} disabled={user.blocked !== 1}
								                    content={this.props.intl.formatMessage({id: 'userManagement.unblock'})}
								                    color={'violet'}/></Table.Cell>
							</Table.Row>
						})}
					</Table.Body>

				</Table>

			</Segment>
		)
	}
}

export default UserManagement = injectIntl(UserManagement)
