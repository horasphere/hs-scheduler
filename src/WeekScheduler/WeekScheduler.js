import React, { Component, PropTypes } from 'react'
import moment from 'moment';
import shallowCompare from 'react-addons-shallow-compare'

import { Scheduler, resourceShape, eventShape } from './../Scheduler'
import defaultHeaderDateRenderer from './defaultHeaderDateRenderer'
import defaultRowDateRenderer from './defaultRowDateRenderer'
import { FlexRow, FlexCell } from './../Flex'
import { LOCAL_DATE_FORMAT } from './../utils/date'

const propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  dates: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  resources: PropTypes.arrayOf(resourceShape).isRequired,
  events: PropTypes.arrayOf(eventShape).isRequired,
  headerDateRenderer: PropTypes.func.isRequired,
  scrollToResource: PropTypes.string
}

const defaultProps = {
  headerDateRenderer: defaultHeaderDateRenderer,
  rowDateRenderer: defaultRowDateRenderer,
  scrollToResource: undefined
}

class WeekScheduler extends Component {
  constructor(props) {
    super(props);

    this.headerContentRenderer = this.headerContentRenderer.bind(this)
    this.rowContentRenderer = this.rowContentRenderer.bind(this)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const {
      width,
      height,
      events,
      resources,
      scrollToResource
      } = this.props;

    // TODO remove
    const indexedEvents = {};
    events.forEach((event) => {
        const idx = event.resourceId + moment(event.start).format(LOCAL_DATE_FORMAT);
        if(!indexedEvents[idx]) {
          indexedEvents[idx] = [];
        }

        indexedEvents[idx].push(event)
    })
    this.indexedEvents = indexedEvents;

    return (
      <Scheduler
        {...this.props}
        autoContainerWidth
        width={width}
        height={height}
        resources={resources}
        events={events}
        className="hs-scheduler--week"
        headerResourceRenderer={() => (<div />)}
        headerContentRenderer={this.headerContentRenderer}
        rowResourceRenderer={({resource, searchQuery, searchMatches}) => {
          return <div style={{backgroundColor: searchMatches.indexOf(resource) > -1 ? 'yellow': 'transparent'}}>{resource.title}<br />{resource.id}</div>
        }}
        rowContentRenderer={this.rowContentRenderer}
        footerResourceRenderer={() => (<div />)}
        footerContentRenderer={() => (<div />)}
        scrollToResource={scrollToResource}
        ref={(ref) => {
            this._scheduler = ref
        }}
        />
    )
  }
  headerContentRenderer() {
    const {
      headerDateRenderer,
      dates
      } = this.props;

    return (
      <FlexRow>
        {
          dates.map((date) => {
            const localDate = moment(date).format(LOCAL_DATE_FORMAT)

            return (
              <FlexCell key={localDate} className="hs-scheduler--week__header__date" width={100 / dates.length}>
                { headerDateRenderer({date}) }
              </FlexCell>
            )
          })
        }
      </FlexRow>
    )
  }
  rowContentRenderer({resource, isScrolling, isVisible, searchQuery, searchMatches}) {

    const indexedEvents = this.indexedEvents;

    const {
      rowDateRenderer,
      dates
      } = this.props;

    return (
      <FlexRow>
        {
          dates.map((date) => {
            const localDate = moment(date).format(LOCAL_DATE_FORMAT)

            // TODO index events by resource-day
            //const filteredEvents = events.filter((event) => {
            //    return event.resourceId === resource.id && localDate === moment(event.start).format(LOCAL_DATE_FORMAT)
            //})
            const idx = resource.id + localDate;
            const filteredEvents = indexedEvents[idx] || [];

            return (
              <FlexCell key={localDate} className="hs-scheduler--week__row__date" width={100 / dates.length}>
                { rowDateRenderer({resource, date, isScrolling, isVisible, events: filteredEvents, searchQuery, searchMatches})  }
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
