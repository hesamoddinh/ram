import React, {Component} from 'react'
import {Container, Form, Grid, Header, Message, Segment} from 'semantic-ui-react'
import {injectIntl, intlShape} from 'react-intl'
import PageBreadcrumb from '../../components/PageBreadcrumb'
import _ from 'lodash'
import DepositService from "../../services/DepositService";
import DepositList from "./components/DepositList";


class Deposit extends Component {
	constructor(props) {
		super(props)
		this.state = {
			accounts: [],
			profitRate: 0,
			success: false,
			error: false
		}
		this.eventEmitter = props.eventEmitter
	}

	componentDidMount() {
		this.getDepositAccounts()
	}


	getDepositAccounts = () => {
		this.setState({accountsLoading: true})
		DepositService.getActiveAccounts()
			.then(payload => {
				let data = []
				payload.forEach(row => {
					let account = row.Record
					data.push({name: account.name, profitRate: account.profitRate})
				})
				this.setState({accounts: data, accountsLoading: false})
			})
			.catch(err => {
				this.setState({accountsLoading: false})

			})
	}

	deposit = () => {
		this.setState({depositLoading: true})
		DepositService.deposit(this.state.account, this.state.amount)
			.then(payload => {
					this.setState({depositLoading: false, success: true})

			})
			.catch(err => {
				console.error(err)
				this.setState({depositLoading: false, error: err.msg})
			})
	}

	onSelectAccount = (e, {value}) => {
		const account = _.find(this.state.accounts, 'name', value);
		this.setState({account: value, profitRate: account.profitRate, error: false, success: false})
	}

	onChangeAmount = (e, {value}) => this.setState({amount: value, error: false, success: false})

	render() {
		const textAlign = this.props.intl.formatMessage({id: 'layout.textAlign'})
		const ORG = localStorage.getItem('org') || 'a'
		return (
			[
				<PageBreadcrumb key="breadcrumb" sections={['home', 'deposit']}/>,
				<Container key="container" className={'section-container'} textAlign={textAlign}>
					<Grid textAlign={textAlign}>
						<Grid.Row>
							<Grid.Column>
								<Segment color={'violet'} padded>
									<Header as='h3' content={this.props.intl.formatMessage({id: 'deposit.title'})}/>
									<Form success={!!this.state.success} error={!!this.state.error} onSubmit={this.deposit}>
										<Form.Group widths='equal'>
											<Form.Select loading={this.state.accountsLoading} fluid
											             onChange={this.onSelectAccount}
											             label={this.props.intl.formatMessage({id: 'deposit.account'})}
											             options={this.state.accounts.map(a => ({
												             key: a.name,
												             value: a.name,
												             text: a.name
											             }))}/>
											<Form.Input type={'number'} fluid
											            min={1}
											            onChange={this.onChangeAmount}
											            label={this.props.intl.formatMessage({id: 'deposit.amount'})}/>
										</Form.Group>
										<Form.Group>
											<Form.Input width={8} type={'number'} fluid
											            readOnly
											            min={1}
											            value={this.state.profitRate}
											            label={this.props.intl.formatMessage({id: 'deposit.profitRate'})}/>

										</Form.Group>
										<Form.Group>
											<Form.Button width={8} fluid loading={this.state.depositLoading}
											             className={'btn-no-margin'}
											             disabled={!this.state.account || !this.state.amount}
											             color={'violet'}>{this.props.intl.formatMessage({id: 'deposit.submit'})}</Form.Button>
										</Form.Group>
										<Message style={{direction: 'ltr', textAlign: 'left'}} error content={this.state.error}/>
										<Message style={{direction: 'ltr', textAlign: 'left'}} success
										         content={'Balance deposited successfully.'}/>
									</Form>
								</Segment>

							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<DepositList/>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			]
		)
	}
}

Deposit.propTypes = {
	intl: intlShape
}

export default injectIntl(Deposit)
