import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactSVG from 'react-svg'

class SvgIcon extends Component {
	constructor (props) {
		super(props)
		this.state = {}
	}

	componentDidMount () {
		const svg = require(`../images/svg/${this.props.name}.svg`)
		this.setState({svg: svg})
	}

	render () {
		let {wrapperClassName, width, stroke, fill} = this.props
		wrapperClassName = wrapperClassName ? `svg-container ${wrapperClassName}` : 'svg-container'
		let style = {
			...{
				width: width,
				stroke: stroke,
				fill: fill
			},
			...this.props.style
		}
		if (this.state.svg) {
			return <ReactSVG
				path={this.state.svg}
				className="svg-icon"
				wrapperClassName={wrapperClassName}
				style={style}
			/>
		} else {
			return null
		}
	}
}

SvgIcon.propTypes = {
	name: PropTypes.string.isRequired,
	width: PropTypes.number.isRequired,
	fill: PropTypes.string,
	stroke: PropTypes.string,
	style: PropTypes.object,
	wrapperClassName: PropTypes.string
}

export default SvgIcon
