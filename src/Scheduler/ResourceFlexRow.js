import React, {Component, PropTypes} from 'react'

const propTypes = {
  resourceColumnVisible: PropTypes.bool.isRequired,
  resourceColumnWidth: PropTypes.number.isRequired,
  resourceChildren: PropTypes.node.isRequired,
  contentChildren: PropTypes.node.isRequired
}

class ResourceFlexRow extends Component {
  render () {
    return (
      <div />
    )
  }
}

ResourceFlexRow.propTypes = propTypes

export default ResourceFlexRow
