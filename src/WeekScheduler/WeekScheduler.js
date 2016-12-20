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
  events: PropTypes.arrayOf(eventShape).isRequired,
  dates: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  headerDateRenderer: PropTypes.func.isRequired
}

const defaultProps = {
  ...Scheduler.defaultProps,
  headerDateRenderer: defaultHeaderDateRenderer,
  rowDateRenderer: defaultRowDateRenderer
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
                  //return eventsByDates[localDate].length

                  let nbAssignations = 0;
                  eventsByDates[localDate].forEach((event) => {
                      nbAssignations += event.assignedQuartDTO.quartDTO.assignationDTOs.length
                  })


                  console.log('hash', `${eventsByDates[localDate].length}q${nbAssignations}a`)
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

    return (
      <FlexRow>
        {
          this.getLocalDates(dates).map((lDate, index) => {
            return (
              <FlexCell style={style} key={lDate} className="hs-scheduler--week__header__date" width={100 / dates.length}>
                { headerDateRenderer({date: dates[index]}) }
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
      dates
      } = this.props;

    return (
      <FlexRow>
        {
          this.getLocalDates(dates).map((lDate, index) => {
            const filteredEvents = eventStore.selectEventsByResourceAndDate(resource.id, lDate)

            return (
              <FlexCell style={style} key={lDate} className="hs-scheduler--week__row__date" width={100 / dates.length}>
                { rowDateRenderer({resource, date: dates[index], isScrolling, isVisible, events: filteredEvents, searchQuery, searchMatches})  }
              </FlexCell>
            )
          })
        }
      </FlexRow>
    )
  }
  footerContentRenderer() {
    const {
      dates
      } = this.props;

    return (
      <FlexRow>
        {
          this.getLocalDates(dates).map((lDate) => {
            return (
              <FlexCell key={lDate} className="hs-scheduler--week__footer__date" width={100 / dates.length}>
                { lDate }
              </FlexCell>
            )
          })
        }
      </FlexRow>
    )
  }
  resetMeasurementForResourceId(resourceId) {
    this._scheduler.resetMeasurementForResourceId(resourceId)
  }
}

WeekScheduler.propTypes = propTypes
WeekScheduler.defaultProps = defaultProps

export default WeekScheduler
