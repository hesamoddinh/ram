import React, {Component} from 'react'
import 'semantic-ui-css/semantic.min.css'
import PrivateRoute from 'components/PrivateRoute'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import DashboardLayout from 'scenes/home/DashboardLayout'
import Signup from './scenes/signup/Signup'
import RedirectIndex from './scenes/RedirectIndex'
import './App.css'
import {IntlProvider} from 'react-intl'

import * as messages from './i18n/'
import Login from './scenes/login/Login'

const Routes = () => (
	[
		<Route key='index' exact path="/" component={RedirectIndex}/>,
		<PrivateRoute key='dashboard' path="/dashboard" component={DashboardLayout}/>,
		<Route key='signup' path="/signup" component={Signup}/>,
		<Route key='login' path="/login" component={Login}/>
	]
)

class App extends Component {
	render () {
		const locale = localStorage.getItem('locale') ? localStorage.getItem('locale') : 'fa'
		return (
			<IntlProvider key={locale} locale={locale} messages={messages[locale]}>
				<Router>
					<Routes/>
				</Router>
			</IntlProvider>
		)
	}
}

export default App
