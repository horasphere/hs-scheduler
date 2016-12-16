import React, { Component, PropTypes } from 'react'
import { Grid as VirtualizedGrid, CellMeasurer } from 'react-virtualized'
import keyBy from 'lodash/keyBy'
import debounce from 'lodash/debounce';
import groupBy from 'lodash/groupBy'
import cn from 'classnames'
import shallowCompare from 'react-addons-shallow-compare'
import moment from 'moment'

import { FlexRow, FlexCell } from './../Flex'
import generateCellRenderer from './generateCellRenderer'
import { eventShape, resourceShape } from './propTypes'
import defaultSearchMethod from './defaultSearchMethod'
import KeyBasedCellSizeCache from './keyBasedCellSizeCache'
import { LOCAL_DATE_FORMAT } from './../utils/date'

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
  headerHeight: 30,
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
    this.findResourceIndex = this.findResourceIndex.bind(this)
    this.resetMeasurementForResourceId = this.resetMeasurementForResourceId.bind(this)
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
    const eventsByResourceId = groupBy(events, 'resourceId')

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
    //TODO remove
    const keyMap = {}
    const keyStats = {
      hits: 0,
      misses: 0
    }

    const logStats = debounce(function() {
      console.log('key stats:', keyStats, keyMap)
    }, 500)

    return (
      <div className={cn('hs-scheduler', className)} style={{width: width}}>
        { this.getRenderedHeader() }
        <CellMeasurer
          cellRenderer={cellRenderer}
          columnCount={COLUMN_COUNT}
          rowCount={resources.length}
          width={width}
          cellSizeCache={new KeyBasedCellSizeCache({
            buildRowKey: (index) => {
                let max = 0;
                const countByDate = {};

                const id = resources[index].id;

                //eventsByResourceId[id].forEach((event) => {
                //    const localDate = moment(event.start).format(LOCAL_DATE_FORMAT)
                //
                //    if(!countByDate[localDate]) {
                //      countByDate[localDate] = 0
                //
                //    }
                //    countByDate[localDate]++;
                //
                //    max = Math.max(max, countByDate[localDate])
                //})
                const eventsByDates = groupBy(eventsByResourceId[id], (event) => (moment(event.start).format(LOCAL_DATE_FORMAT)))

                const key = Object.keys(eventsByDates)
                  .map((localDate) => {
                      return eventsByDates[localDate].length
                  })
                .sort()
                .filter(function(item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                })
                .join('|')


                if(keyMap[key])
                  keyStats.hits++
                 else
                  keyStats.misses++

                keyMap[key] = true;

                logStats();
                return key;
            }
          })}
          ref={(ref) => {
              this._cellMeasurer = ref
          }}
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
              rowHeight={getRowHeight}
              rowCount={resources.length}
              cellRenderer={cellRenderer}
              scrollToAlignment="start"
              scrollToRow={scrollToRow}
              noContentRenderer={noResourcesRenderer}
              ref={(ref) => {
                  this._virtualGrid = ref;
              }}
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
  findResourceIndex(id) {
    const resources = this.props.resources;

    for(var i=0; i < resources.length; i++) {
      if(resources[i].id === id) {
        return i;
      }
    }

    return -1;
  }
  resetMeasurementForResourceId(resourceId) {
    const resourceIndex = this.findResourceIndex(resourceId);

    if(resourceIndex > -1) {
      this._cellMeasurer.resetMeasurementForRow(resourceIndex)
      this._virtualGrid.recomputeGridSize({columnIndex: 0, rowIndex: resourceIndex})
    }

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

    const style = {
      height: headerHeight
    }

    return (<FlexRow style={{height: headerHeight, paddingRight: 17}} className={cn('hs-scheduler__header', headerClassName)}>
      {(resourceColumnVisible)
            ? <FlexCell width={resourceColumnWidth}>
              { headerResourceRenderer() }
            </FlexCell>
            : null
        }
      <FlexCell width={this.contentColumnWidth}>
        { headerContentRenderer({style}) }
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

    const sectionStyle = {
      height: style.height
    }

    return (
      <div key={key} style={{...style}} className={cn('hs-scheduler__row', rowClassName)}>
        <FlexRow>
          {(resourceColumnVisible)
            ? <FlexCell width={resourceColumnWidth}>
              { rowResourceRenderer({resource, searchQuery, searchMatches, style: sectionStyle}) }
            </FlexCell>
            : null
          }
          <FlexCell width={this.contentColumnWidth}>
            { rowContentRenderer({resource, isScrolling, isVisible, style: sectionStyle}) }
          </FlexCell>
        </FlexRow>
      </div>
    )
  }
}

Scheduler.propTypes = propTypes
Scheduler.defaultProps = defaultProps

export default Scheduler
