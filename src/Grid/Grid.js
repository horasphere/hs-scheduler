import React, {Component, PropTypes} from 'react'
import elementType from 'react-prop-types/lib/elementType'
import moment from 'moment'
import extend from 'lodash/extend'

import WeekView from './WeekView'
import DateHeader from './DateHeader'
import {resourceShape, weekComponentsShape} from './propTypes'

const propTypes = {
  resources: PropTypes.arrayOf(resourceShape).isRequired,
  view: PropTypes.oneOf(['week']),
  weekdayFormat: PropTypes.string,
  dates: PropTypes.arrayOf(Date).isRequired,
  showResourcesColumn: PropTypes.bool,
  showHeader: PropTypes.bool,
  isLoading: PropTypes.bool,
  loading: PropTypes.element,
  empty: PropTypes.element,
  components: PropTypes.shape({
    week: PropTypes.shape({
      headerTitle: elementType,
      headerWeekday: elementType,
      assignment: elementType,
      resource: elementType
    })
  })
}

const defaultProps = {
  view: 'week',
  weekdayFormat: 'ddd D MMM',
  showResourcesColumn: true,
  showHeader: true,
  isLoading: false,
  loading: <div style={{textAlign: 'center'}}>Loading...</div>,
  empty: <div style={{textAlign: 'center'}}>No resources to display</div>,
  components: {
    week: {
      headerTitle: function (props) {
        return null
      },
      headerWeekday: function (props) {
        return <DateHeader date={props.date} format={props.weekdayFormat} />
      },
      assignment: function (props) {
        const {start, end} = props.assignment
        return <div>{moment(start).format('HH:mm')} - {moment(end).format('HH:mm')}</div>
      },
      resource: function(props) {
        return <span>{props.resource.name}</span>
      }
    }
  }
}

class Scheduler extends Component {
  renderWeekView () {
    return (
      <WeekView
        dates={this.props.dates}
        weekdayFormat={this.props.weekdayFormat}
        resources={this.props.resources}
        isLoading={this.props.isLoading}
        showResourcesColumn={this.props.showResourcesColumn}
        showHeader={this.props.showHeader}
        loading={this.props.loading}
        empty={this.props.empty}
        components={extend({}, defaultProps.components.week, this.props.components.week)}
            />
    )
  }
  render () {
    const {view} = this.props

    if (view === 'week') {
      return this.renderWeekView()
    }

    throw new Error('Unknown view....' + view)
  }
}

Scheduler.propTypes = propTypes
Scheduler.defaultProps = defaultProps

export default Scheduler
