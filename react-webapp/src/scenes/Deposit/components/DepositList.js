import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {injectIntl} from 'react-intl'
import {Header, Segment, Table} from 'semantic-ui-react'
import DepositService from "../../../services/DepositService";
import {timeToJalaliDate} from "../../../utils/MomentUtil";

class DepositList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			list: []
		}
	}

	componentDidMount () {
		this.queryUserDeposits()
	}

	queryUserDeposits = () => {
		this.setState({loading: true})
		DepositService.queryUserDeposits()
			.then(payload => {
				let data = []
				payload.forEach(row => {
					let deposit = row.Record
					data.push(deposit)
				})
				this.setState({list: data, loading: false})
			})
			.catch(err => {
				this.setState({loading: false})

			})
	}

	render() {
		return (
			<Segment loading={this.state.loading} padded>
				<Header as='h3' content={this.props.intl.formatMessage({id: 'deposit.list'})}/>
				<Table style={{direction: 'rtl'}} color={'violet'} textAlign={'center'} striped>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>{this.props.intl.formatMessage({id: 'deposit.row'})}</Table.HeaderCell>
							<Table.HeaderCell>{this.props.intl.formatMessage({id: 'deposit.account'})}</Table.HeaderCell>
							<Table.HeaderCell>{this.props.intl.formatMessage({id: 'deposit.amount'})}</Table.HeaderCell>
							<Table.HeaderCell>{this.props.intl.formatMessage({id: 'deposit.totalProfitPaid'})}</Table.HeaderCell>
							<Table.HeaderCell>{this.props.intl.formatMessage({id: 'deposit.created'})}</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{this.state.list.map((l, i) => {
							return <Table.Row key={i}>
								<Table.Cell className={'faNo'}>{i+1}</Table.Cell>
								<Table.Cell>{l.account}</Table.Cell>
								<Table.Cell className={'faNo'}>{l.amount}</Table.Cell>
								<Table.Cell className={'faNo'}>{l.TotalProfitPaid}</Table.Cell>
								<Table.Cell>{timeToJalaliDate(Date.parse(l.Created))}</Table.Cell>
							</Table.Row>
						})}
						{!this.state.list.length ?
							<Table.Row>
								<Table.Cell/>
								<Table.Cell>{this.props.intl.formatMessage({id: 'deposit.list.empty'})}</Table.Cell>
							</Table.Row>
							: null}
					</Table.Body>
				</Table>
			</Segment>
		)
	}
}

DepositList.propTypes = {
}

export default DepositList = injectIntl(DepositList)
