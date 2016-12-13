import React, { Component, PropTypes } from 'react'
import { Grid as VirtualizedGrid, CellMeasurer } from 'react-virtualized'
import keyBy from 'lodash/keyBy'
import cn from 'classnames'

import generateCellRenderer from './generateCellRenderer'
import { eventShape, resourceShape } from './propTypes'

const COLUMN_COUNT = 1

const propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  startOfWeek: PropTypes.oneOf([0, 1, 2, 3, 5, 6]).isRequired, // Sunday to Saturday
  resources: PropTypes.arrayOf(resourceShape).isRequired,
  noResourcesRenderer: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(eventShape).isRequired,
  rowRenderer: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  headerHeight: PropTypes.number.isRequired,
  headerRenderer: PropTypes.func.isRequired,
  headerClassName: PropTypes.string.isRequired,
  footerVisible: PropTypes.bool.isRequired,
  footerHeight: PropTypes.number.isRequired,
  footerRenderer: PropTypes.func.isRequired,
  footerClassName: PropTypes.string.isRequired
}

const defaultProps = {
  date: new Date(),
  startOfWeek: 0, // Sunday,
  noResourcesRenderer: () => null,
  className: '',
  headerHeight: 0,
  headerRenderer: () => null,
  headerClassName: '',
  footerVisible: true,
  footerHeight: 0,
  footerRenderer: () => null,
  footerClassName: ''
}

class Scheduler extends Component {
  render () {
    const {
        resources,
        noResourcesRenderer,
        events,
        rowRenderer,
        className,
        headerClassName,
        headerRenderer,
        headerHeight,
        footerVisible,
        footerClassName,
        footerRenderer,
        footerHeight,
        height,
        width
    } = this.props

    const cellRenderer = generateCellRenderer({
      resources,
      resourceById: keyBy(resources, 'id'),
      eventById: keyBy(events, 'id'),
      rowRenderer
    })

    let bodyHeight = height - headerHeight
    if(footerVisible) {
      bodyHeight -= footerHeight
    }

    return (
    <div className={cn('hs-scheduler', className)}>
        <div style={{height: headerHeight}} className={cn('hs-scheduler__header', headerClassName)}>
          { headerRenderer() }
        </div>
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
            height={bodyHeight}
            columnCount={COLUMN_COUNT}
            columnWidth={width}
            overscanColumnCount={0}
            overscanRowCount={0}
            rowHeight={getRowHeight}
            rowCount={resources.length}
            cellRenderer={cellRenderer}
            noContentRenderer={noResourcesRenderer}
            />
        )}
      </CellMeasurer>
      {
        (footerVisible)
            ? <div style={{height: footerHeight}} className={cn('hs-scheduler__footer', footerClassName)}>
                { footerRenderer() }
              </div>
            : null
      }

    </div>
    )
  }
}

Scheduler.propTypes = propTypes
Scheduler.defaultProps = defaultProps

export default Scheduler
