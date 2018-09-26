import {Component} from 'react'
import {injectIntl, intlShape} from 'react-intl'

class Translate extends Component {
	getString = (id) => {
		return this.props.intl.formatMessage({id: id})
	}
}

Translate.propTypes = {
	intl: intlShape
}
export default injectIntl(Translate)
