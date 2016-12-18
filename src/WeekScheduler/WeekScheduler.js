import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import omit from 'lodash/omit'
import shallowCompare from 'react-addons-shallow-compare'

import { Scheduler, resourceShape, eventShape } from './../Scheduler'
import defaultHeaderDateRenderer from './defaultHeaderDateRenderer'
import defaultRowDateRenderer from './defaultRowDateRenderer'
import { FlexRow, FlexCell } from './../Flex'
import { LOCAL_DATE_FORMAT } from './../utils/date'

const schedulerPropTypes = omit(Scheduler.propTypes, [
  'headerContentRenderer',
  'rowContentRenderer',
  'footerContentRenderer'
]);

const propTypes = {
  ...schedulerPropTypes,
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
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render () {
    const {
      events,
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
        className="hs-scheduler--week"
        headerContentRenderer={this.headerContentRenderer}
        rowContentRenderer={this.rowContentRenderer}
        footerContentRenderer={this.footerContentRenderer}
        ref={(ref) => {
            this._scheduler = ref
        }}
        />
    )
  }
  headerContentRenderer({style}) {
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
              <FlexCell style={style} key={localDate} className="hs-scheduler--week__header__date" width={100 / dates.length}>
                { headerDateRenderer({date}) }
              </FlexCell>
            )
          })
        }
      </FlexRow>
    )
  }
  rowContentRenderer({resource, isScrolling, isVisible, searchQuery, searchMatches, style}) {

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
              <FlexCell style={style} key={localDate} className="hs-scheduler--week__row__date" width={100 / dates.length}>
                { rowDateRenderer({resource, date, isScrolling, isVisible, events: filteredEvents, searchQuery, searchMatches})  }
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
          dates.map((date) => {
            const localDate = moment(date).format(LOCAL_DATE_FORMAT)

            return (
              <FlexCell key={localDate} className="hs-scheduler--week__footer__date" width={100 / dates.length}>
                { localDate }
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
