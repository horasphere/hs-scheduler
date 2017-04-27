import React, { Component, PropTypes } from 'react'
import elementType from 'react-prop-types/lib/elementType'
import moment from 'moment'

import { getAssignmentsByResourceAndDate } from './../utils/resourceHelper'
import {resourceShape} from './propTypes'
import {LOCAL_DATE_FORMAT} from './../utils/date'

const propTypes = {
  dates: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  resource: resourceShape.isRequired,
  index: PropTypes.number.isRequired,
  indexedResources: PropTypes.object.isRequired,
  showResourcesColumn: PropTypes.bool.isRequired,
  assignmentComponent: elementType.isRequired,
  rowClassName: PropTypes.func.isRequired
}

class WeekBodyRow extends Component {
  renderTitleColumn () {
    const {resource, resourceComponent: Resource} = this.props

    return <div className='hs-scheduler__body__row__title'>
      <Resource resource={resource} />
    </div>
  }
  renderWeekdayColumn (date) {
    const {indexedResources, resource, assignmentComponent} = this.props
    const {id: resourceId} = resource
    const assignments = getAssignmentsByResourceAndDate(resourceId, date, indexedResources)
    const Assignment = assignmentComponent
    const key = moment(date).format(LOCAL_DATE_FORMAT)

    return (
      <div className='hs-scheduler__body__row__date' key={key}>
        {assignments.map((assignment) => {
          return <Assignment
            key={assignment.id}
            resourceId={resourceId}
            assignment={assignment} />
        })}
      </div>
    )
  }
  render () {
    const {
      index,
      resource,
      dates,
      showResourcesColumn,
      rowClassName
    } = this.props

    const {id: resourceId} = resource

    const className = 'hs-scheduler__body__row ' + rowClassName({index, resource, dates})

    return (
      <div className={className} key={resourceId}>
        {(showResourcesColumn)
                    ? this.renderTitleColumn()
                    : null
                }
        {dates.map((date) => {
          return this.renderWeekdayColumn(date)
        }, this)}
      </div>
    )
  }
}

WeekBodyRow.propTypes = propTypes

export default WeekBodyRow
