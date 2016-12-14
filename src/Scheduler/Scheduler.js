import React, { Component, PropTypes } from 'react'
import { Grid as VirtualizedGrid, CellMeasurer } from 'react-virtualized'
import keyBy from 'lodash/keyBy'
import cn from 'classnames'
import shallowCompare from 'react-addons-shallow-compare'

import { FlexRow, FlexCell } from './../Flex'
import generateCellRenderer from './generateCellRenderer'
import { eventShape, resourceShape } from './propTypes'

const COLUMN_COUNT = 1

const propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
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
  noResourcesRenderer: () => null,
  className: '',
  headerHeight: 0,
  headerClassName: '',
  rowClassName: '',
  footerVisible: true,
  footerHeight: 0,
  footerClassName: '',
  resourceColumnWidth: 12,
  resourceColumnVisible: true
}

class Scheduler extends Component {
  constructor (props) {
    super(props)

    this.rowRenderer = this.rowRenderer.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    console.log('Scheduler[render]')
    const props = this.props;
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
    } = props


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

        <CellMeasurer
          cellRenderer={cellRenderer}
          columnCount={COLUMN_COUNT}
          rowCount={resources.length}
          width={width}
        >
          {({ getRowHeight }) => (
            <VirtualizedGrid
              {...props}
              autoContainerWidth
              estimatedRowSize={75}
              width={width}
              height={bodyHeight}
              columnCount={COLUMN_COUNT}
              columnWidth={width}
              overscanColumnCount={0}
              overscanRowCount={20}
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
          { rowContentRenderer({resource, isScrolling, isVisible}) }
        </FlexCell>
      </FlexRow>
    )
  }
}

Scheduler.propTypes = propTypes
Scheduler.defaultProps = defaultProps

export default Scheduler
