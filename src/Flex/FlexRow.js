import React, {Component, PropTypes} from 'react'

import FlexCell from './FlexCell'

const propTypes = {
  children: (props, propName, componentName) => {
    const children = React.Children.toArray(props.children)
    for (let i = 0; i < children.length; i++) {
      if (children[i].type !== FlexCell) {
        return new Error('FlexRow only accepts children of type FlexCell')
      }
    }
  },
  style: PropTypes.object,
  className: PropTypes.string
}

const defaultProps = {
  style: {},
  className: ''
}

class FlexRow extends Component {
  render () {
    const { style, className, children } = this.props

    const rowStyle = {
      boxSizing: 'border-box',
      display: 'flex',
      flex: '1 1 auto',
      flexDirection: 'row',
      flexWrap: 'wrap',
      ...style
    }

    return (
      <div className={className} style={rowStyle}>
        { children }
      </div>
    )
  }
}

FlexRow.propTypes = propTypes
FlexRow.defaultProps = defaultProps

export default FlexRow
