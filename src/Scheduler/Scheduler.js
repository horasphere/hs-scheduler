import React, { Component, PropTypes } from 'react'
import { Grid as VirtualizedGrid, CellMeasurer } from 'react-virtualized'
import keyBy from 'lodash/keyBy'
import cn from 'classnames'
import shallowCompare from 'react-addons-shallow-compare'

import { FlexRow, FlexCell } from './../Flex'
import generateCellRenderer from './generateCellRenderer'
import { eventShape, resourceShape } from './propTypes'
import defaultSearchMethod from './defaultSearchMethod'

const COLUMN_COUNT = 1

const propTypes = {
  className: PropTypes.string.isRequired,
  events: PropTypes.arrayOf(eventShape).isRequired,
  footerClassName: PropTypes.string.isRequired,
  footerContentRenderer: PropTypes.func.isRequired,
  footerHeight: PropTypes.number.isRequired,
  footerResourceRenderer: PropTypes.func.isRequired,
  footerVisible: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  headerHeight: PropTypes.number.isRequired,
  headerResourceRenderer: PropTypes.func.isRequired,
  headerContentRenderer: PropTypes.func.isRequired,
  headerClassName: PropTypes.string.isRequired,
  noResourcesRenderer: PropTypes.func.isRequired,
  resources: PropTypes.arrayOf(resourceShape).isRequired,
  resourceColumnVisible: PropTypes.bool.isRequired, // TODO could rename to resourceVisible
  resourceColumnWidth: PropTypes.number.isRequired, // width in %
  rowClassName: PropTypes.string.isRequired,
  rowContentRenderer: PropTypes.func.isRequired,
  rowResourceRenderer: PropTypes.func.isRequired,
  searchQuery: PropTypes.any,
  searchMethod: PropTypes.func,
  searchFinished: PropTypes.func,
  scrollToResource: PropTypes.string,
  width: PropTypes.number.isRequired
}

const defaultProps = {
  className: '',
  footerClassName: '',
  footerHeight: 0,
  footerVisible: true,
  headerHeight: 0,
  headerClassName: '',
  noResourcesRenderer: () => null,
  resourceColumnVisible: true,
  resourceColumnWidth: 12,
  rowClassName: '',
  searchQuery: null,
  searchMethod: defaultSearchMethod,
  searchFinished: () => {},
  scrollToResource: undefined
}

class Scheduler extends Component {
  constructor (props) {
    super(props)

    this.state = {
      searchMatches: []
    }

    this.rowRenderer = this.rowRenderer.bind(this)
    this.search = this.search.bind(this)
  }
  componentWillMount() {
    this.search(this.props)
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.searchQuery !== nextProps.searchQuery) {
      this.search(nextProps)
    }
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
      width,
      scrollToResource,
      searchQuery
    } = props

    const { searchMatches}  = this.state;

    const resourceById = keyBy(resources, 'id')

    const cellRenderer = generateCellRenderer({
      resources,
      resourceById: resourceById,
      eventById: keyBy(events, 'id'),
      rowRenderer: this.rowRenderer,
      searchMatches,
      searchQuery
    })

    const scrollToRow = (scrollToResource && resourceById[scrollToResource]) ? resources.indexOf(resourceById[scrollToResource]) : undefined;

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
              {...props}
              autoContainerWidth
              scrollingResetTimeInterval={300}
              width={width}
              height={bodyHeight}
              columnCount={COLUMN_COUNT}
              columnWidth={width}
              overscanColumnCount={0}
              overscanRowCount={10}
              rowHeight={300}
              rowCount={resources.length}
              cellRenderer={cellRenderer}
              scrollToAlignment="start"
              scrollToRow={scrollToRow}
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
  search(props) {
    let searchMatches = [];

    const {
      resources,
      searchMethod,
      searchQuery,
      searchFinished
    } = props;

    if(searchQuery !== null) {
      searchMatches = resources.filter((resource) => {
          return searchMethod({resource, searchQuery})
      })
    }

    this.setState({
      searchMatches
    })

    searchFinished({matches: searchMatches, searchQuery})
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
    key,
    searchQuery,
    searchMatches
    }) {
    const {
      rowClassName,
      rowResourceRenderer,
      rowContentRenderer,
      resourceColumnWidth,
      resourceColumnVisible
      } = this.props

    //TODO remove backgroundColor
    return (
      <div key={key} style={{...style, backgroundColor: 'transparent'}} className={cn('hs-scheduler__row', rowClassName)}>
        <FlexRow>
          {(resourceColumnVisible)
            ? <FlexCell width={resourceColumnWidth}>
              { rowResourceRenderer({resource, searchQuery, searchMatches}) }
            </FlexCell>
            : null
          }
          <FlexCell width={this.contentColumnWidth}>
            { rowContentRenderer({resource, isScrolling, isVisible}) }
          </FlexCell>
        </FlexRow>
      </div>
    )
  }
}

Scheduler.propTypes = propTypes
Scheduler.defaultProps = defaultProps

export default Scheduler
