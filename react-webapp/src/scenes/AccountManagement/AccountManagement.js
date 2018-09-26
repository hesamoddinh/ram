import React, {Component} from 'react'
import {Button, Container, Dropdown, Form, Grid, Header, Input, Message, Segment} from 'semantic-ui-react'
import {FormattedMessage, injectIntl, intlShape} from 'react-intl'
import PageBreadcrumb from '../../components/PageBreadcrumb'
import _ from 'lodash'
import DepositService from "../../services/DepositService";
import UserProfits from "./components/UserProfits";

class AccountManagement extends Component {
	constructor(props) {
		super(props)
		this.state = {
			accounts: [],
			profitRate: 0,
			success: false,
			error: false,
			profits: undefined,
			account: {
				profitRate: 0,
				balance: 0
			},
			profitRateEditable: false
		}
		this.eventEmitter = props.eventEmitter
	}

	componentDidMount() {
		this.getDepositAccounts()
	}

	payProfits = () => {
		if (!this.state.account.profitRate) {
			this.setState({warning: this.props.intl.formatMessage({id:'accountManagement.profits.rateRequired'})})
			return
		}
		this.setState({payLoading: true, warning: false, payError: false})
		DepositService.payProfits(this.state.account.name, this.state.account.profitRate)
			.then(payload => {
				this.setState({payLoading: false, paySuccess: true}, () => {
					this.calculateProfits()
				})

			})
			.catch(err => {
				this.setState({payLoading: false, payError: err.msg})
			})
	}

	calculateProfits = () => {
		if (!this.state.account.profitRate) {
			this.setState({warning: this.props.intl.formatMessage({id:'accountManagement.profits.rateRequired'})})
			return
		}
		this.setState({calcLoading: true, warning: false, payError: false})
		DepositService.calculateProfits(this.state.account.name, this.state.account.profitRate)
			.then(payload => {
				this.setState({profits: payload, calcLoading: false})
			})
			.catch(err => {
				this.setState({calcLoading: false})
			})
	}

	getDepositAccounts = () => {
		this.setState({accountsLoading: true})
		DepositService.getActiveAccounts()
			.then(payload => {
				let data = []
				payload.forEach(row => {
					let account = row.Record
					data.push(account)
				})
				this.setState({accounts: data, accountsLoading: false})
			})
			.catch(err => {
				this.setState({accountsLoading: false})

			})
	}

	onSelectAccount = (e, {value}) => {
		const account = _.find(this.state.accounts, 'name', value);
		this.setState({account, error: false, success: false})
	}

	toggleProfitRateEdit = () => {
		this.setState({profitRateEditable: !this.state.profitRateEditable}, () => {
			if (this.state.profitRateEditable) {
				this.focus()
			}
		})
	}

	onChangeProfitRate = (e, {value}) => {
		let account = this.state.account
		account.profitRate = value
		this.setState({account})

	}

	handleRef = (c) => {
		this.inputRef = c
	}

	focus = () => {
		this.inputRef.focus()
	}


	render() {
		const textAlign = this.props.intl.formatMessage({id: 'layout.textAlign'})
		let accountSelected = !!this.state.account.name
		return (
			[
				<PageBreadcrumb key="breadcrumb" sections={['home', 'deposit']}/>,
				<Container key="container" className={'section-container'} textAlign={textAlign}>
					<Segment color={'violet'}  loading={this.props.loading} padded>
						<Header as='h3' content={this.props.intl.formatMessage({id: 'accountManagement.profits.title'})}/>
						<Form warning={this.state.warning} success={this.state.paySuccess} error={!!this.state.payError}>
							<Grid textAlign={textAlign}>
								<Grid.Row>
									<Grid.Column width={8}>
										<Form.Field>
											<label><FormattedMessage id={'accountManagement.account'}/></label>
											<Dropdown fluid onChange={this.onSelectAccount} selection
											          loading={this.state.accountsLoading}
											          placeholder={this.props.intl.formatMessage({id: 'deposit.account'})}
											          options={this.state.accounts.map(a => ({key: a.name, value: a.name, text: a.name}))}/>
										</Form.Field>
									</Grid.Column>
									<Grid.Column width={5}>
										<Form.Field>
											<label><FormattedMessage id={'accountManagement.profitRate'}/></label>
											<Input ref={this.handleRef} disabled={!accountSelected} onChange={this.onChangeProfitRate} fluid
											       readOnly={!this.state.profitRateEditable} value={this.state.account.profitRate}/>
										</Form.Field>
									</Grid.Column>
									<Grid.Column verticalAlign={'bottom'} width={3}>
										<Button disabled={!accountSelected} fluid
										        content={this.props.intl.formatMessage({id: 'accountManagement.editProfitRate'})}
										        color={'violet'} basic onClick={this.toggleProfitRateEdit}/>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column width={8}>
										<Form.Field>
											<label><FormattedMessage id={'accountManagement.balance'}/></label>
											<Input disabled={!accountSelected} fluid readOnly value={this.state.account.balance}/>
										</Form.Field>
									</Grid.Column>
									<Grid.Column width={4} verticalAlign={'bottom'}>
										<Button disabled={!accountSelected} onClick={this.calculateProfits} basic
										        loading={this.state.calcLoading} className={'no-margin'}
										        content={this.props.intl.formatMessage({id: 'accountManagement.profitCalculate'})}
										        color={'violet'}
										        fluid/>
									</Grid.Column>
									<Grid.Column width={4} verticalAlign={'bottom'}>
										<Button disabled={!accountSelected} onClick={this.payProfits} loading={this.state.payLoading}
										        className={'no-margin'}
										        content={this.props.intl.formatMessage({id: 'accountManagement.profitPay'})}
										        color={'violet'}
										        fluid/>
									</Grid.Column>
								</Grid.Row>
							</Grid>
							<Message style={{direction: 'ltr', textAlign: 'left'}} error content={this.state.payError}/>
							<Message style={{direction: 'rtl', textAlign: 'right'}} success
							         content={this.props.intl.formatMessage({id: 'accountManagement.profit.success'})}/>
							<Message style={{direction: 'rtl', textAlign: 'right'}} warning content={this.state.warning}/>
						</Form>
					</Segment>
					<UserProfits loading={this.state.calcLoading} data={this.state.profits}/>
				</Container>
			]
		)
	}
}

AccountManagement.propTypes = {
	intl: intlShape
}

export default injectIntl(AccountManagement)
