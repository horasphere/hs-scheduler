import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import omit from 'lodash/omit'
import keyBy from 'lodash/keyBy'
import groupBy from 'lodash/groupBy'
import memoize from 'lodash/memoize'
import shallowCompare from 'react-addons-shallow-compare'

import { Scheduler, resourceShape, eventShape } from './../Scheduler'
import defaultHeaderDateRenderer from './defaultHeaderDateRenderer'
import defaultRowDateRenderer from './defaultRowDateRenderer'
import defaultFooterDateRenderer from './defaultFooterDateRenderer'
import defaultTimelineBlockRenderer from './defaultTimelineBlockRenderer'
import { FlexRow, FlexCell } from './../Flex'
import { localDate } from './../utils/date'
import WeekEventStore from './WeekEventStore'

const schedulerPropTypes = omit(Scheduler.propTypes, [
  'headerContentRenderer',
  'rowContentRenderer',
  'footerContentRenderer',
  'eventStore'
]);

const propTypes = {
  ...schedulerPropTypes,
  dates: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  events: PropTypes.arrayOf(eventShape).isRequired,
  footerDateRenderer: PropTypes.func,
  headerDateRenderer: PropTypes.func,
  timelineHeight: PropTypes.number,
  timelineVisible: PropTypes.bool,
  timelineBlockRenderer: PropTypes.func
}

const defaultProps = {
  ...Scheduler.defaultProps,
  footerDateRenderer: defaultFooterDateRenderer,
  headerDateRenderer: defaultHeaderDateRenderer,
  rowDateRenderer: defaultRowDateRenderer,
  timelineBlockRenderer: defaultTimelineBlockRenderer,
  timelineHeight: 10,
  timelineVisible: true
}

class WeekScheduler extends Component {
  constructor(props) {
    super(props);

    this.headerContentRenderer = this.headerContentRenderer.bind(this)
    this.rowContentRenderer = this.rowContentRenderer.bind(this)
    this.footerContentRenderer = this.footerContentRenderer.bind(this)
    this.getEventStore = memoize(this.getEventStore)
    this.getLocalDates = memoize(this.getLocalDates)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.events !== nextProps.events) {
      // clear cache to prevent the memory to grow
      this.getEventStore.cache.clear();
    }
  }
  render () {
    const {
      events,
      } = this.props;

    return (
      <Scheduler
        {...this.props}
        className="hs-scheduler--week"
        eventStore={this.getEventStore(events)}
        headerContentRenderer={this.headerContentRenderer}
        rowContentRenderer={this.rowContentRenderer}
        footerContentRenderer={this.footerContentRenderer}
        resourceScheduleHash={({resource, index, eventStore}) => {
            const eventsByDates = groupBy(eventStore.selectEventsByResource(resource.id), (event) => (localDate(event.start)))

            return Object.keys(eventsByDates)
              .map((localDate) => {
                  let nbAssignations = 0;
                  eventsByDates[localDate].forEach((event) => {
                      nbAssignations += event.assignedQuartDTO.quartDTO.assignationDTOs.length
                  })

                  return `${eventsByDates[localDate].length}q${nbAssignations}a`
              })
            .sort()
            .filter(function(item, pos, ary) {
                return !pos || item != ary[pos - 1];
            })
            .join('|')
        }}
        ref={(ref) => {
            this._scheduler = ref
        }}
        />
    )
  }
  getLocalDates(dates) {
    return dates.map((date) => {
        return localDate(date);
    })
  }
  getEventStore(events) {
    return new WeekEventStore(events)
  }
  headerContentRenderer({style}) {
    const {
      headerDateRenderer,
      dates
      } = this.props;

    const cellStyle = {
      height: style.height
    }

    return (
      <FlexRow>
        {
          this.getLocalDates(dates).map((lDate, index) => {
            return (
              <FlexCell style={style} key={lDate} className="hs-scheduler--week__header__date" width={100 / dates.length}>
                {
                  headerDateRenderer({
                    date: dates[index],
                    dateIndex: index,
                    style: cellStyle
                  })
                }
              </FlexCell>
            )
          })
        }
      </FlexRow>
    )
  }
  rowContentRenderer({resource, resourceById, eventStore, isScrolling, isVisible, searchQuery, searchMatches, style}) {
    const {
      rowDateRenderer,
      dates,
      timelineHeight,
      timelineVisible,
      timelineBlockRenderer
      } = this.props;

    const cellHeight = (timelineVisible) ? style.height - timelineHeight : style.height;
    const childs = [];

    childs.push(
      <FlexRow>
        {
          this.getLocalDates(dates).map((lDate, index) => {
            const filteredEvents = eventStore.selectEventsByResourceAndDate(resource.id, lDate)

            const cellStyle = {
              height: cellHeight
            }


            return (
              <FlexCell style={{...style, height: cellHeight}} key={lDate} className="hs-scheduler--week__row__date" width={100 / dates.length}>
                {
                  rowDateRenderer({
                    resource,
                    date: dates[index],
                    dateIndex: index,
                    isScrolling,
                    isVisible,
                    events: filteredEvents,
                    searchQuery,
                    searchMatches,
                    style: cellStyle
                  })
                }
              </FlexCell>
            )
          })
        }
      </FlexRow>
    )

    if(timelineVisible) {
      const filteredEvents = eventStore.selectEventsByResource(resource.id)
      const min = moment(localDate(dates[0]))
      const max = moment(localDate(dates[dates.length -1])).add('1', 'days')
      const total = max.diff(min);

      childs.push(
        <FlexRow className="hs-scheduler--week__row__timeline" style={{height: timelineHeight}}>
          <FlexCell width={100} style={{position: 'relative'}}>
            {
              filteredEvents.map((event) => {
                const start = moment(event.start);
                const end = moment(event.end);

                let left = start.diff(min) / total * 100;
                if(left < 0) {
                  left = 0;
                }

                let right = end.diff(min) / total * 100;
                if(right > 100) {
                  right = 100;
                }

                return timelineBlockRenderer({
                  resource,
                  event,
                  isScrolling,
                  isVisible,
                  style: {
                    position: 'absolute',
                    left: `${left}%`,
                    right: `${100 - right}%`
                  }
                })
              })
            }
          </FlexCell>
        </FlexRow>
      )
    }

    return childs;
  }
  footerContentRenderer({style}) {
    const {
      dates,
      footerDateRenderer
      } = this.props;

    const cellStyle = {
      height: style.height
    }

    return (
      <FlexRow>
        {
          this.getLocalDates(dates).map((lDate, index) => {
            return (
              <FlexCell key={lDate} style={style} className="hs-scheduler--week__footer__date" width={100 / dates.length}>
                 { footerDateRenderer({date: dates[index], dateIndex: index, style: cellStyle}) }
              </FlexCell>
            )
          })
        }
      </FlexRow>
    )
  }
  resetMeasurementForResourceIds(resourceIds) {
    this._scheduler.resetMeasurementForResourceIds(resourceIds)
  }
  resetAllMeasurements() {
    this._scheduler.resetAllMeasurements()
  }
}

WeekScheduler.propTypes = propTypes
WeekScheduler.defaultProps = defaultProps

export default WeekScheduler
