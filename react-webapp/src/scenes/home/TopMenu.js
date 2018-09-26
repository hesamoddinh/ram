import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Dropdown, Header, Icon, Label, Menu} from 'semantic-ui-react'
import {FormattedMessage, injectIntl, intlShape} from 'react-intl'
import Security from '../../utils/Security'
import {withRouter} from 'react-router'
// import HttpRequest, {backEnd} from '../../utils/HttpRequest'

// const endPoint = `${backEnd}/listen/`
// let client

const resultRenderer = ({title, typetitle}) => {
	return [<span key={1}>{title}</span>,
		<Label size={'mini'} style={{position: 'absolute', left: '5px'}} key={2} content={typetitle}/>]
}

resultRenderer.propTypes = {
	title: PropTypes.string,
	typetitle: PropTypes.string
}

class TopMenu extends Component {
	constructor (props) {
		super(props)
		this.state = {
			notifs: 0,
			searchLoading: false
		}
	}

	logout = () => {
		Security.signout()
			.then(() => {
				this.props.history.push('/')
			})
	}

	/*socketConnect = () => {
		const userId = localStorage.getItem('id')
		const sock = new SockJS(endPoint)
		client = Stomp.over(sock)
		client.debug = true
		client.connect({}, (frame) => {
			client.subscribe(`/user/${userId}/queue/unseenNotificationCount`, (message) => {
				let data = JSON.parse(message.body)
				console.log('notif count >>>>>>>>', data)
			})
		})
	}*/

	componentWillReceiveProps (nextProps) {
		if (nextProps.location.pathname === '/dashboard/notification/history') {
			this.seenNotification()
				.then(() => {
					this.getNotificationCount()
				})
		} else if (nextProps.location.pathname !== this.props.location.pathname) {
			this.getNotificationCount()
		}
	}

	seenNotification = () => {
		// return HttpRequest.post('/notificationLog/seenAll')
	}

	getNotificationCount = () => {
		/*HttpRequest.post('/notificationLog/count')
			.then(payload => {
				this.setState({notifs: payload.data})
			})*/
	}

	/*search = (e, {value}) => {
		this.setState({searchLoading: true})
		HttpRequest.post('/device/getDeviceOrDeviceGroup', {word: value})
			.then(payload => {
				this.setState({searchLoading: false})
				let results = []
				payload.data.data.map(item => {
					let obj = {
						id: item.id,
						title: item.result,
						type: item.type,
						typetitle: this.props.intl.formatMessage({id: item.type})
					}
					results.push(obj)
				})
				this.setState({searchResult: results})
			})
	}*/

	componentDidMount () {
		// this.socketConnect()
		// this.getNotificationCount()
	}

	onClickSearchResult = (e, item) => {
		/*const id = item.result.id
		const type = item.result.type === 'Device' ? 'device' : 'group'
		const url = `/dashboard/${type}/detail/${id}`
		this.props.history.push(url)*/
	}

	render () {
		const direction = this.props.intl.formatMessage({id: 'layout.direction'})
		const textAlign = this.props.intl.formatMessage({id: 'layout.textAlign'})
		return (
			<Menu borderless style={{
				border: '0',
				boxShadow: 'none',
				height: '60px',
				direction: 'ltr'
			}}>
				<Dropdown item icon={<Icon color={'violet'} size="big" name='user circle outline'/>}>
					<Dropdown.Menu>
						{/*<Dropdown.Item>
							<CustomLink style={{color: 'grey'}} to={'/dashboard/password'}>
								<Icon name='lock'/>
								<span className='text'><FormattedMessage id={'changePassword'}/></span>
							</CustomLink>
						</Dropdown.Item>*/}
						<Dropdown.Item style={{color: 'grey!important'}} onClick={this.logout}>
							<div style={{color: 'grey'}}>
								<Icon name='sign out'/>
								<span className='text'><FormattedMessage id={'logout'}/></span>
							</div>
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
				<Menu.Item>
                    <Header color={'violet'} as='h5'>
                    {localStorage.getItem("username")}
                    </Header>
				</Menu.Item>
				{/*<Menu.Menu style={{width: '45%'}} position="right">
					<Menu.Item style={{direction: 'rtl', width: '100%'}}>
						<Search
							style={{width: '100%'}}
							resultRenderer={resultRenderer}
							className={'faNo'}
							noResultsMessage={<FormattedMessage id={'search.noResult'}/>}
							fluid
							input={{style: {width: '100%', fontSize: '12px'}, icon: 'search'}}
							placeholder={this.props.intl.formatMessage({id: 'topMenu.search'})}
							minCharacters={3}
							loading={this.state.searchLoading}
							onResultSelect={this.onClickSearchResult}
							onSearchChange={this.search}
							results={this.state.searchResult}
						/>

					</Menu.Item>
				</Menu.Menu>*/}
			</Menu>
		)
	}
}

TopMenu.propTypes = {
	intl: intlShape
}

export default withRouter(injectIntl(TopMenu))
