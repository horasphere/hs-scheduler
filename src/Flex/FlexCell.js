import React, {Component, PropTypes} from 'react'
import { DropTarget } from 'react-dnd';

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
    const { width, style, className, children, connectDropTarget, isOver, dropZone } = this.props

        const cellStyle = {
            boxSizing: 'border-box',
            flex: `1 1 ${width}%`,
            maxWidth: `${width}%`,
            ...style
        }

    return (
      connectDropTarget(<div className={className} style={{...cellStyle, backgroundColor: (isOver && dropZone) ? 'blue': 'transparent'}}>
        { children }
      </div>)
    )
  }
}

FlexCell.propTypes = propTypes
FlexCell.defaultProps = defaultProps


export default DropTarget(() => ('quart'), {}, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(FlexCell)
