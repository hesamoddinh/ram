import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Icon, Menu} from 'semantic-ui-react'
import {FormattedMessage, injectIntl, intlShape} from 'react-intl'
import Security from '../../utils/Security'
import {withRouter} from 'react-router'
import classNames from 'classnames'
import SvgIcon from '../../components/SvgIcon'

let MenuItem = (props) => {
	return <Menu.Item  className={classNames({
		'side-menu-item': true,
		'active-item': props.active
	})} name={props.name} active={props.active}
	                  onClick={props.onClick}>
		<Icon name={props.icon}/>
		<FormattedMessage id={`sideMenu.${props.textId}`}/>
	</Menu.Item>
}

MenuItem.propTypes = {
	active: PropTypes.bool.isRequired,
	name: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
	textId: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired
}

class SideMenu extends Component {
	constructor (props) {
		super(props)
		this.state = {
			activeItem: props.location.pathname.substr(1),
			org: localStorage.getItem('org')
			// isAdmin: Security.isAuthorized(['ADMIN'])
		}
	}

	detectActiveItem = () => {
		let activeItem = ''
		switch (this.props.location.pathname) {
			case 'dashboard':
				activeItem = 'dashboard'
				break
		}
		this.setState({activeItem})
	}
	handleItemClick = (e, item) => {
		let activeItem
		if (this.state.activeItem === item.name) {
			activeItem = ''
		} else {
			activeItem = item.name
		}
		this.setState({activeItem}, () => {
			if (item.name === 'dashboard') {
				this.props.history.push('/dashboard')
			} else if (item.name === 'deposit') {
				this.props.history.push('/dashboard/deposit')
			} else if (item.name === 'accountManagement') {
				this.props.history.push('/dashboard/manage/account')
			}

		})
	}

	logout = () => {
		Security.signout()
	}

	componentDidMount () {
		this.detectActiveItem()
	}

	render () {
		let {activeItem, org} = this.state
		const textAlign = this.props.intl.formatMessage({id: 'layout.textAlign'})
		return (
			<Menu
				id={'side-menu'}
				style={{
					padding:'66px 15px 0 0',
					textAlign: textAlign,
					direction: this.props.intl.formatMessage({id: 'layout.direction'})
				}}
				borderless
				vertical
				stackable
				fluid
			>
				<MenuItem active={activeItem === 'dashboard'} name={'dashboard'} onClick={this.handleItemClick}
				          textId={'dashboard'} icon={'home'}/>
				{/*{isAdmin && activeItem === 'users'
					? <MenuItem active={submenu === 'newUser'} name={'newUser'} onClick={this.handleItemClick}
					            textId={'users.new'} icon={'add'}/>
					: null}*/}
				{org === 'a' ?
					<MenuItem active={activeItem === 'deposit'} name={'deposit'} onClick={this.handleItemClick}
					            textId={'deposit'} icon={'percent'}/>
					: null}
				{org === 'b' ?
					<MenuItem active={activeItem === 'accountManagement'} name={'accountManagement'} onClick={this.handleItemClick}
					          textId={'accountManagement'} icon={'percent'}/>
					: null}
			</Menu>
		)
	}
}

SideMenu.propTypes = {
	intl: intlShape
}

export default withRouter(injectIntl(SideMenu))
