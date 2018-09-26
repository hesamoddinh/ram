import React from 'react'
import PropTypes from 'prop-types'
import {Redirect, Route} from 'react-router-dom'
import Security from '../utils/Security'

const PrivateRoute = ({component: Component, ...rest}) => {
	return <Route {...rest} render={props => (
		!Security.isAuthenticated() ? (
			<Redirect to={{
				pathname: '/login',
				state: {from: props.location}
			}}/>
		) : rest.org && !Security.isAuthorized(rest.org) ? (
			<Redirect to={{
				pathname: '/dashboard',
				state: {from: props.location}
			}}/>
		) : (<Component eventEmitter={rest.eventEmitter ? rest.eventEmitter : null} {...props}/>)
	)}/>
}
PrivateRoute.propTypes = {
	component: PropTypes.func.isRequired
}
export default PrivateRoute
