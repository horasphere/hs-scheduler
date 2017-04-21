import React, { Component, PropTypes } from 'react'
import elementType from 'react-prop-types/lib/elementType'
import moment from 'moment'

import { getAssignmentsByResourceAndDate } from './../utils/resourceHelper'
import {resourceShape} from './propTypes'
import {LOCAL_DATE_FORMAT} from './../utils/date'

const propTypes = {
  dates: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  resource: resourceShape.isRequired,
  indexedResources: PropTypes.object.isRequired,
  showResourcesColumn: PropTypes.bool.isRequired,
  assignmentComponent: elementType.isRequired
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
    const {resource, dates, showResourcesColumn} = this.props
    const {id: resourceId} = resource

    return (
      <div className='hs-scheduler__body__row' key={resourceId}>
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
