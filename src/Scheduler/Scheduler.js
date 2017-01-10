import React, { Component, PropTypes } from 'react'
import { Grid as VirtualizedGrid, CellMeasurer } from 'react-virtualized'
import keyBy from 'lodash/keyBy'
import debounce from 'lodash/debounce';
import groupBy from 'lodash/groupBy'
import cn from 'classnames'
import shallowCompare from 'react-addons-shallow-compare'
import moment from 'moment'

import defaultRowResourceRenderer from './defaultRowResourceRenderer'
import { FlexRow, FlexCell } from './../Flex'
import generateCellRenderer from './generateCellRenderer'
import { eventShape, resourceShape } from './propTypes'
import defaultSearchMethod from './defaultSearchMethod'
import KeyBasedCellSizeCache from './keyBasedCellSizeCache'
import { LOCAL_DATE_FORMAT } from './../utils/date'

const propTypes = {
  className: PropTypes.string,
  eventStore: PropTypes.object.isRequired,
  footerClassName: PropTypes.string,
  footerContentRenderer: PropTypes.func.isRequired,
  footerHeight: PropTypes.number,
  footerResourceRenderer: PropTypes.func,
  footerVisible: PropTypes.bool,
  height: PropTypes.number.isRequired,
  headerHeight: PropTypes.number,
  headerResourceRenderer: PropTypes.func,
  headerContentRenderer: PropTypes.func.isRequired,
  headerClassName: PropTypes.string,
  noResourcesRenderer: PropTypes.func,
  resources: PropTypes.arrayOf(resourceShape).isRequired,
  resourceVisible: PropTypes.bool,
  resourceColumnWidth: PropTypes.number, // width in %
  resourceScheduleHash: PropTypes.func,
  rowClassName: PropTypes.string,
  rowContentRenderer: PropTypes.func.isRequired,
  rowResourceRenderer: PropTypes.func,
  searchQuery: PropTypes.any,
  searchMethod: PropTypes.func,
  searchFinished: PropTypes.func,
  scrollToResource: PropTypes.string,
  width: PropTypes.number.isRequired
}

const defaultProps = {
  className: '',
  footerClassName: '',
  footerHeight: 30,
  footerVisible: false,
  footerResourceRenderer: () => null,
  headerHeight: 30,
  headerClassName: '',
  headerResourceRenderer: () => null,
  noResourcesRenderer: () => null,
  resourceColumnWidth: 12,
  resourceScheduleHash: ({resource, index}) => index,
  resourceVisible: true,
  rowClassName: '',
  rowResourceRenderer: defaultRowResourceRenderer,
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
      className,
      headerHeight,
      footerVisible,
      footerHeight,
      height,
      width,
      scrollToResource,
      searchQuery,
      resourceScheduleHash,
      eventStore
    } = props

    const { searchMatches}  = this.state;

    const resourceById = keyBy(resources, 'id')

    const cellRenderer = generateCellRenderer({
      resources,
      resourceById: resourceById,
      eventStore,
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
      <div className={cn('hs-scheduler', className)} style={{width: width}}>
        { this.getRenderedHeader() }
        <CellMeasurer
          cellRenderer={cellRenderer}
          columnCount={1}
          rowCount={resources.length}
          width={width}
          cellSizeCache={new KeyBasedCellSizeCache({
            buildRowKey: (index) => {
                return resourceScheduleHash({resource: resources[index], eventStore, index});
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
              columnCount={1}
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
      }).map((resource) => {
          return resource.id;
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
      resourceVisible
    } = this.props

    return (resourceVisible) ? 100 - resourceColumnWidth : 100
  }
  getRenderedHeader () {
    const {
      headerHeight,
      headerClassName,
      headerResourceRenderer,
      headerContentRenderer,
      resourceColumnWidth,
      resourceVisible
      } = this.props

    const style = {
      height: headerHeight + 'px'
    }

    return (<FlexRow style={{height: headerHeight, paddingRight: 17}} className={cn('hs-scheduler__header', headerClassName)}>
      {(resourceVisible)
            ? <FlexCell className="hs-scheduler__header__resource" width={resourceColumnWidth}>
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
      resourceVisible
      } = this.props

    const style = {
      height: footerHeight + 'px'
    }

    return (<FlexRow style={{height: footerHeight, paddingRight: 17}} className={cn('hs-scheduler__footer', footerClassName)}>
      {(resourceVisible)
          ? <FlexCell className="hs-scheduler__footer__resource" width={resourceColumnWidth}>
            { footerResourceRenderer() }
          </FlexCell>
          : null
        }
      <FlexCell width={this.contentColumnWidth}>
        { footerContentRenderer({style}) }
      </FlexCell>
    </FlexRow>
    )
  }
  rowRenderer ({
    index,
    style,
    resource,
    resourceById,
    eventStore,
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
      resourceVisible
      } = this.props

    const sectionStyle = {
      height: style.height
    }

    const isEven = (index % 2 === 0)

    return (
      <div key={key} style={{...style}} className={cn('hs-scheduler__row', rowClassName, {
        'hs-scheduler__row--odd': !isEven,
        'hs-scheduler__row--even': isEven
      })}>
        <FlexRow>
          {(resourceVisible)
            ? <FlexCell className="hs-scheduler__row__resource" width={resourceColumnWidth}>
              { rowResourceRenderer({resource, eventStore, resourceById, searchQuery, searchMatches, style: sectionStyle}) }
            </FlexCell>
            : null
          }
          <FlexCell width={this.contentColumnWidth}>
            { rowContentRenderer({resource, eventStore, resourceById, isScrolling, isVisible, style: sectionStyle}) }
          </FlexCell>
        </FlexRow>
      </div>
    )
  }
}

Scheduler.propTypes = propTypes
Scheduler.defaultProps = defaultProps

export default Scheduler
