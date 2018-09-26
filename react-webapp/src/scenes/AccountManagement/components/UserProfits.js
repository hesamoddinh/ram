import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {injectIntl} from 'react-intl'
import {Header, Segment, Table} from 'semantic-ui-react'
import {isEmpty} from "lodash";

class UserProfits extends Component {
	constructor(props) {
		super(props)
		this.state = {
			totalProfit: 0,
			list: []
		}
		this.eventEmitter = props.eventEmitter
	}

	componentDidMount () {
		let totalProfit = 0
		if (this.props.data) {
			let list = Object.keys(this.props.data).map((key, index) => {
				totalProfit += this.props.data[key]
				return {user: key, amount: this.props.data[key]}
			})
			this.setState({list, totalProfit})
		}
	}

	componentWillReceiveProps(nextProps) {
		let totalProfit = 0
		if (nextProps.data) {
			let list = Object.keys(nextProps.data).map((key, index) => {
				totalProfit += nextProps.data[key]
				return {user: key, amount: nextProps.data[key]}
			})
			this.setState({list, totalProfit})
		}
	}

	render() {
		return (
			<Segment loading={this.props.loading} padded>
				<Header as='h3' content={this.props.intl.formatMessage({id: 'accountManagement.profits.title'})}/>
				<Table style={{direction: 'ltr'}} color={'violet'} textAlign={'center'} striped>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>{this.props.intl.formatMessage({id: 'accountManagement.profits.amount'})}</Table.HeaderCell>
							<Table.HeaderCell>{this.props.intl.formatMessage({id: 'accountManagement.profits.username'})}</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{this.state.list.map((l, i) => {
							return <Table.Row key={i}>
								<Table.Cell className={'faNo'}>{l.amount}</Table.Cell>
								<Table.Cell>{l.user}</Table.Cell>
							</Table.Row>
						})}
						{isEmpty(this.state.list) ?
							<Table.Row>
								<Table.Cell/>
								<Table.Cell>{this.props.intl.formatMessage({id: 'accountManagement.profits.empty'})}</Table.Cell>
							</Table.Row>
							: null}
					</Table.Body>
					<Table.Footer>
						<Table.Row>
							<Table.HeaderCell className={'faNo'}>{this.state.totalProfit}</Table.HeaderCell>
							<Table.HeaderCell>{this.props.intl.formatMessage({id: 'accountManagement.profits.total'})}</Table.HeaderCell>
						</Table.Row>
					</Table.Footer>
				</Table>
			</Segment>
		)
	}
}

UserProfits.propTypes = {
	data: PropTypes.object,
	loading: PropTypes.bool
}

export default UserProfits = injectIntl(UserProfits)
