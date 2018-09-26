import React, {Component} from 'react'
import {injectIntl} from 'react-intl'
import {Header, Segment, Table} from 'semantic-ui-react'
import UserService from '../../../services/UserService'
import {timeToJalaliDate} from '../../../utils/MomentUtil'

class Logs extends Component {
	constructor(props) {
		super(props)
		this.state = {
			logs: []
		}
		this.eventEmitter = props.eventEmitter
	}

	componentDidMount() {
		this.queryLogs()
		this.eventEmitter.on('reloadLogs', this.queryLogs)
	}

	queryLogs = () => {
		this.setState({loading: true})
		UserService.queryAllLogs()
			.then(payload => {
				let logs = payload.map(l => {
					return {text: l.Record.value, created: l.Record.Created}
				})
				this.setState({logs, loading: false})
			})
			.catch(err => {
				this.setState({loading: false})
			})
	}

	render() {
		return (
			<Segment loading={this.state.loading} padded>
				<Header as='h3' content={this.props.intl.formatMessage({id: 'logs.title'})}/>
				<Table style={{direction: 'ltr'}} color={'violet'} textAlign={'center'} striped>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>{this.props.intl.formatMessage({id: 'logs.value'})}</Table.HeaderCell>
							<Table.HeaderCell>{this.props.intl.formatMessage({id: 'logs.created'})}</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{this.state.logs.map((l, i) => {
							return <Table.Row key={i}>
								<Table.Cell>{l.text}</Table.Cell>
								<Table.Cell>{timeToJalaliDate(Date.parse(l.created))}</Table.Cell>

							</Table.Row>
						})}
					</Table.Body>
				</Table>
			</Segment>
		)
	}
}

export default Logs = injectIntl(Logs)
