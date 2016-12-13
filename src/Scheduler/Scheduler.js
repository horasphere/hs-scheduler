import React, { Component, PropTypes } from 'react'
import { Grid as VirtualizedGrid, CellMeasurer } from 'react-virtualized'
import keyBy from 'lodash/keyBy'
import cn from 'classnames'

import { FlexRow, FlexCell } from './../Flex'
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
  rowResourceRenderer: PropTypes.func.isRequired,
  rowContentRenderer: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  headerHeight: PropTypes.number.isRequired,
  headerResourceRenderer: PropTypes.func.isRequired,
  headerContentRenderer: PropTypes.func.isRequired,
  headerClassName: PropTypes.string.isRequired,
  footerVisible: PropTypes.bool.isRequired,
  footerHeight: PropTypes.number.isRequired,
  footerResourceRenderer: PropTypes.func.isRequired,
  footerContentRenderer: PropTypes.func.isRequired,
  footerClassName: PropTypes.string.isRequired,
  resourceColumnWidth: PropTypes.number.isRequired // width %
}

const defaultProps = {
  date: new Date(),
  startOfWeek: 0, // Sunday,
  noResourcesRenderer: () => null,
  className: '',
  headerHeight: 0,
  headerClassName: '',
  headerResourceRenderer: () => (null),
  headerContentRenderer: () => (null),
  footerVisible: true,
  footerHeight: 0,
  footerResourceRenderer: () => null,
  footerContentRenderer: () => null,
  footerClassName: '',
  resourceColumnWidth: 12
}

class Scheduler extends Component {
  constructor(props) {
    super(props)

    this.rowRenderer = this.rowRenderer.bind(this);
  }
  render () {
    const {
      resources,
      noResourcesRenderer,
      events,
      className,
      headerClassName,
      headerResourceRenderer,
      headerContentRenderer,
      headerHeight,
      footerVisible,
      footerClassName,
      footerResourceRenderer,
      footerContentRenderer,
      footerHeight,
      height,
      width,
      resourceColumnWidth
    } = this.props

    const cellRenderer = generateCellRenderer({
      resources,
      resourceById: keyBy(resources, 'id'),
      eventById: keyBy(events, 'id'),
      rowRenderer: this.rowRenderer
    })

    let bodyHeight = height - headerHeight
    if(footerVisible) {
      bodyHeight -= footerHeight
    }

    return (
    <div className={cn('hs-scheduler', className)}>
        <FlexRow style={{height: headerHeight}} className={cn('hs-scheduler__header', headerClassName)}>
          <FlexCell width={resourceColumnWidth}>
            { headerResourceRenderer() }
          </FlexCell>
          <FlexCell width={100 - resourceColumnWidth}>
            { headerContentRenderer() }
          </FlexCell>
        </FlexRow>
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
            ? <FlexRow style={{height: footerHeight}} className={cn('hs-scheduler__footer', footerClassName)}>
                <FlexCell width={resourceColumnWidth} >
                  { footerResourceRenderer() }
                </FlexCell>
                <FlexCell width={100 - resourceColumnWidth}>
                  { footerContentRenderer() }
                </FlexCell>
              </FlexRow>
            : null
      }

    </div>
    )
  }
  rowRenderer({
    index,
    style,
    resource,
    resourceById,
    eventById,
    isScrolling,
    isVisible,
    key
    }) {

    const { rowResourceRenderer, rowContentRenderer, resourceColumnWidth } = this.props

    return (
      <FlexRow key={key} style={style}>
        <FlexCell width={resourceColumnWidth}>
          { rowResourceRenderer() }
        </FlexCell>
        <FlexCell width={100 - resourceColumnWidth}>
          { rowContentRenderer() }
        </FlexCell>
      </FlexRow>
    )
  }
}

Scheduler.propTypes = propTypes
Scheduler.defaultProps = defaultProps

export default Scheduler
