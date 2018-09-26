import React, {Component} from 'react'
import propTypes from 'prop-types'
import {injectIntl, intlShape} from 'react-intl'
import {Breadcrumb, Header, Icon} from 'semantic-ui-react'

class PageBreadcrumb extends Component {
	render () {
		return <Header
			attached={'top'}
			style={{
				padding: '20px 25px',
				direction: this.props.intl.formatMessage({id: 'layout.direction'}),
				boxShadow: 'rgb(198, 198, 198) 0px 4px 6px -3px',
				border: '0',
				borderRadius: '0',
				background: '#f5f5f5'
			}}>
			<Breadcrumb size={'tiny'} style={{color: '#828282'}}>
				{this.props.sections.map((sec, index) => {
					if (sec === 'home' && index !== this.props.sections.length - 1) {
						return (
							<span key={index}><Breadcrumb.Section><Icon style={{color: '#828282'}} name={'home'}
							                                            size={'large'}/></Breadcrumb.Section>
							<Breadcrumb.Divider
								icon={this.props.intl.locale === 'fa' ? 'left chevron' : 'right chevron'}/></span>)
					} else if (index !== this.props.sections.length - 1) {
						return (
							<span
								key={index}><Breadcrumb.Section>{this.props.intl.formatMessage({id: 'breadcrumb.' + sec})}</Breadcrumb.Section>
								<Breadcrumb.Divider
									icon={this.props.intl.locale === 'fa' ? 'left chevron' : 'right chevron'}/></span>)
					} else {
						return <Breadcrumb.Section
							key={index}>{this.props.intl.formatMessage({id: 'breadcrumb.' + sec})}</Breadcrumb.Section>
					}
				})}
			</Breadcrumb>
		</Header>
	}
	
	static propTypes = {
		sections: propTypes.array.isRequired
	}
}
PageBreadcrumb.propTypes = {
	intl: intlShape
}
export default injectIntl(PageBreadcrumb)
