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
  rowClassName: PropTypes.string.isRequired,
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
  resourceColumnWidth: PropTypes.number.isRequired, // width in %
  resourceColumnVisible: PropTypes.bool.isRequired
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
  rowClassName: '',
  footerVisible: true,
  footerHeight: 0,
  footerResourceRenderer: () => null,
  footerContentRenderer: () => null,
  footerClassName: '',
  resourceColumnWidth: 12,
  resourceColumnVisible: true
}

class Scheduler extends Component {
  constructor (props) {
    super(props)

    this.rowRenderer = this.rowRenderer.bind(this)
  }
  render () {
    const {
      resources,
      noResourcesRenderer,
      events,
      className,
      headerHeight,
      footerVisible,
      footerHeight,
      height,
      width
    } = this.props

    const cellRenderer = generateCellRenderer({
      resources,
      resourceById: keyBy(resources, 'id'),
      eventById: keyBy(events, 'id'),
      rowRenderer: this.rowRenderer
    })

    let bodyHeight = height - headerHeight
    if (footerVisible) {
      bodyHeight -= footerHeight
    }

    return (
      <div className={cn('hs-scheduler', className)}>
        { this.getRenderedHeader() }
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
              ? this.getRenderedFooter()
              : null
        }

      </div>
    )
  }
  get contentColumnWidth () {
    const {
      resourceColumnWidth,
      resourceColumnVisible
    } = this.props

    return (resourceColumnVisible) ? 100 - resourceColumnWidth : 100
  }
  getRenderedHeader () {
    const {
      headerHeight,
      headerClassName,
      headerResourceRenderer,
      headerContentRenderer,
      resourceColumnWidth,
      resourceColumnVisible
      } = this.props

    return (<FlexRow style={{height: headerHeight}} className={cn('hs-scheduler__header', headerClassName)}>
      {(resourceColumnVisible)
            ? <FlexCell width={resourceColumnWidth}>
              { headerResourceRenderer() }
            </FlexCell>
            : null
        }
      <FlexCell width={this.contentColumnWidth}>
        { headerContentRenderer() }
      </FlexCell>
    </FlexRow>
    )
  }
  getRenderedFooter () {
    const {
      footerHeight,
      footerClassName,
      footerResourceRenderer,
      footerContentRenderer,
      resourceColumnWidth,
      resourceColumnVisible
      } = this.props

    return (<FlexRow style={{height: footerHeight}} className={cn('hs-scheduler__footer', footerClassName)}>
      {(resourceColumnVisible)
          ? <FlexCell width={resourceColumnWidth}>
            { footerResourceRenderer() }
          </FlexCell>
          : null
        }
      <FlexCell width={this.contentColumnWidth}>
        { footerContentRenderer() }
      </FlexCell>
    </FlexRow>
    )
  }
  rowRenderer ({
    index,
    style,
    resource,
    resourceById,
    eventById,
    isScrolling,
    isVisible,
    key
    }) {
    const {
      rowClassName,
      rowResourceRenderer,
      rowContentRenderer,
      resourceColumnWidth,
      resourceColumnVisible
      } = this.props

    return (
      <FlexRow key={key} style={style} className={cn('hs-scheduler__row', rowClassName)}>
        {(resourceColumnVisible)
          ? <FlexCell width={resourceColumnWidth}>
            { rowResourceRenderer() }
          </FlexCell>
          : null
        }
        <FlexCell width={this.contentColumnWidth}>
          { rowContentRenderer() }
        </FlexCell>
      </FlexRow>
    )
  }
}

Scheduler.propTypes = propTypes
Scheduler.defaultProps = defaultProps

export default Scheduler
