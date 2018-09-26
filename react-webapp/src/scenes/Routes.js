import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Dashboard from './home/Dashboard'
import PrivateRoute from '../components/PrivateRoute'
import {Switch} from 'react-router'
import Deposit from "./Deposit/Deposit";
import AccountManagement from "./AccountManagement/AccountManagement";


class Routes extends Component {

	constructor(props) {
		super(props)
	}

	render () {
		return (
			<Switch>
				<PrivateRoute exact key='home' eventEmitter={this.props.eventEmitter} path="/dashboard" component={Dashboard}/>
				<PrivateRoute org={'a'} key='deposit' eventEmitter={this.props.eventEmitter} path="/dashboard/deposit" component={Deposit}/>
				<PrivateRoute org={'b'} key='accountManagement' eventEmitter={this.props.eventEmitter} path="/dashboard/manage/account" component={AccountManagement}/>

				{/*<PrivateRoute eventEmitter={this.props.eventEmitter} key='change-password' path="/dashboard/password"
				              component={ChangePassword}/>*/}
			</Switch>
		)
	}
}

Routes.propTypes = {
	eventEmitter: PropTypes.any
}

export default Routes
