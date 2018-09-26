import React, {Component, Fragment} from 'react'
import {Container, Grid} from 'semantic-ui-react'
import {injectIntl, intlShape} from 'react-intl'
import PageBreadcrumb from '../../components/PageBreadcrumb'
import {sortBy} from 'lodash'
import Account from './components/Account'
import SendCoinForm from './components/SendCoinForm'
import UserManagement from './components/UserManagement'
import GenerateCoinForm from './components/GenerateCoinForm'
import Logs from './components/Logs'
import DepositService from "../../services/DepositService";


class Dashboard extends Component {
	constructor(props) {
		super(props)
		this.state = {}
		this.eventEmitter = props.eventEmitter
	}

	componentDidMount() {
	}



	render() {
		const textAlign = this.props.intl.formatMessage({id: 'layout.textAlign'})
		const ORG = localStorage.getItem('org') || 'a'
		return (
			[
				<PageBreadcrumb key="breadcrumb" sections={['home', 'dashboard']}/>,
				<Container key="container" className={'section-container'} textAlign={textAlign}>
					<Grid textAlign={textAlign}>
						<Grid.Row>
							{ORG === 'a'
								? <Fragment>
									<Grid.Column width={10}>
										<SendCoinForm eventEmitter={this.eventEmitter}/>
									</Grid.Column>
									<Grid.Column textAlign={'center'} width={6}>
										<Account eventEmitter={this.eventEmitter}/>
									</Grid.Column>
								</Fragment> : null}
							{ORG === 'b'
								? <Grid.Column width={16}>
									<UserManagement eventEmitter={this.eventEmitter}/>
								</Grid.Column>
								: null}
							{ORG === 'c'
								? <Grid.Column width={16}>
									<GenerateCoinForm eventEmitter={this.eventEmitter}/>
								</Grid.Column>
								: null}
						</Grid.Row>
						<Grid.Row>
							<Grid.Column width={16}>
								<Logs eventEmitter={this.eventEmitter}/>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			]
		)
	}
}

Dashboard.propTypes = {
	intl: intlShape
}

export default injectIntl(Dashboard)
