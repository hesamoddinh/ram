import React, {Component} from 'react'

import {Grid, Segment} from 'semantic-ui-react'

import SideMenu from './SideMenu'
import Routes from '../Routes'
import {injectIntl, intlShape} from 'react-intl'
import TopMenu from './TopMenu'
import NotificationSystem from 'react-notification-system'
import EventEmitter from 'eventemitter3'

class DashboardLayout extends Component {
	constructor (props) {
		super(props)
		this.eventEmitter = new EventEmitter()
	}

	componentDidMount () {
		this.eventEmitter.on('newAlert', this.onAlert)
	}

	onAlert = (data) => {
		this._notificationSystem = this.refs.notificationSystem
		this._notificationSystem.addNotification({
			title: this.props.intl.formatMessage({id: data.status === 200 ? 'success' : 'error'}),
			message: data.msg ? data.msg : this.props.intl.formatMessage({id: `alert.${data.case}.${data.status}.msg`}),
			level: data.status === 200 ? 'success' : 'error',
			position: 'tl'
		})
	}

	render () {
		const direction = this.props.intl.formatMessage({id: 'layout.direction'})
		return (
			<Grid>
				<Grid.Row className="no-padding">
					<NotificationSystem ref="notificationSystem"/>
					<Grid.Column style={{paddingLeft: '0', zIndex: '999'}} width={3}>
						<SideMenu key='side-menu'/>
					</Grid.Column>
					<Grid.Column className="no-padding" width={13}>
						<Grid>
							<Grid.Row style={{padding: '28px 25px 0 35px'}} verticalAlign="middle">
								<Grid.Column className="no-padding" width={16}>
									<TopMenu/>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row className="no-padding">
								<Grid.Column className="no-padding">
									<Segment key='main-segment' basic
									         style={{
										         background: '#fafafa',
										         direction: direction,
										         padding: '0',
										         marginTop: '0',
										         minHeight: '90vh'
									         }}>
										<Routes eventEmitter={this.eventEmitter}/>
									</Segment>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		)
	}
}

DashboardLayout.propTypes = {
	intl: intlShape
}

export default injectIntl(DashboardLayout)
