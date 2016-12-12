import React, { Component, PropTypes } from 'react'
import { Grid as VirtualizedGrid, CellMeasurer } from 'react-virtualized'
import keyBy from 'lodash/keyBy'

import generateCellRenderer from './generateCellRenderer'
import { eventShape, resourceShape } from './propTypes'

const COLUMN_COUNT = 1

const propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  startOfWeek: PropTypes.oneOf([0, 1, 2, 3, 5, 6]).isRequired, // Sunday to Saturday
  resources: PropTypes.arrayOf(resourceShape).isRequired,
  events: PropTypes.arrayOf(eventShape).isRequired,
  rowRenderer: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
}

const defaultProps = {
  date: new Date(),
  startOfWeek: 0 // Sunday
}

class Scheduler extends Component {
  render () {
    const {
        resources,
        events,
        rowRenderer,
        height,
        width
    } = this.props

    const cellRenderer = generateCellRenderer({
      resources,
      resourceById: keyBy(resources, 'id'),
      eventById: keyBy(events, 'id'),
      rowRenderer
    })

    return (
      <CellMeasurer
        cellRenderer={cellRenderer}
        columnCount={COLUMN_COUNT}
        rowCount={resources.length}
        width={width}
                    >
        {({ getRowHeight }) => (
          <VirtualizedGrid
            autoContainerWidth
            width={width}
            height={height}
            columnCount={COLUMN_COUNT}
            columnWidth={width}
            overscanColumnCount={0}
            overscanRowCount={0}
            rowHeight={getRowHeight}
            rowCount={resources.length}
            cellRenderer={cellRenderer}
                            />
                    )}
      </CellMeasurer>
    )
  }
}

Scheduler.propTypes = propTypes
Scheduler.defaultProps = defaultProps

export default Scheduler
