import React, {Component, PropTypes} from 'react'

const propTypes = {
  width: PropTypes.number.isRequired,
  style: PropTypes.object,
  className: PropTypes.string
}

const defaultProps = {
  style: {},
  className: ''
}

class FlexCell extends Component {
  render () {
    const { width, style, className, children } = this.props

        const cellStyle = {
            boxSizing: 'border-box',
            flex: `1 1 ${width}%`,
            maxWidth: `${width}%`,
            ...style
        }

    return (
      <div className={className} style={cellStyle}>
        { children }
      </div>
    )
  }
}

FlexCell.propTypes = propTypes
FlexCell.defaultProps = defaultProps

export default FlexCell
