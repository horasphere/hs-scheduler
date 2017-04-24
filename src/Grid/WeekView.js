import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import elementType from 'react-prop-types/lib/elementType'

import { resourceShape, weekComponentsShape } from './propTypes'
import { indexResources } from './../utils/resourceHelper'
import WeekBodyRow from './WeekBodyRow'

const propTypes = {
  dates: PropTypes.arrayOf(Date).isRequired,
  resources: PropTypes.arrayOf(resourceShape).isRequired,
  weekdayFormat: PropTypes.string.isRequired,
  showResourcesColumn: PropTypes.bool.isRequired,
  showHeader: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  loading: PropTypes.element.isRequired,
  empty: PropTypes.element.isRequired,
  components: PropTypes.shape({
    headerTitle: elementType.isRequired,
    headerWeekday: elementType.isRequired,
    assignment: elementType.isRequired,
    resource: elementType.isRequired
  })
}

class Week extends Component {
  renderHeader (dates) {
    const showResourcesColumn = this.props.showResourcesColumn
    const HeaderTitle = this.props.components.headerTitle
    const HeaderWeekday = this.props.components.headerWeekday

    return (
      <div className='hs-scheduler__header'>
        {(showResourcesColumn)
                        ? <div className='hs-scheduler__header__title'>
                          <HeaderTitle />
                        </div>
                        : null
                    }
        {dates.map((date) => {
          const key = moment(date).format('D-M-YY')
          return <div className='hs-scheduler__header__date' key={key}>
            <HeaderWeekday
              date={date}
              weekdayFormat={this.props.weekdayFormat}
                                />
          </div>
        }, this)}
      </div>
    )
  }
  renderBodyRows (dates, indexedResources) {
    const {showResourcesColumn, showHeader} = this.props
    const Assignment = this.props.components.assignment
    const Resource = this.props.components.resource

    const className = (showHeader) ? 'hs-scheduler__body' : 'hs-scheduler__body hs-scheduler__body-without-header';

    return (
      <div className={className}>
        {this.props.resources.map((resource) => {
          return <WeekBodyRow
            key={resource.id}
            dates={dates}
            resource={resource}
            resourceComponent={Resource}
            indexedResources={indexedResources}
            showResourcesColumn={showResourcesColumn}
            assignmentComponent={Assignment}
                        />
        })}
      </div>
    )
  }
  renderLoading () {
    const {loading} = this.props

    return (
      <div className='hs-scheduler__body'>
        {loading}
      </div>
    )
  }
  renderEmpty () {
    const {empty} = this.props

    return (
      <div className='hs-scheduler__body'>
        {empty}
      </div>
    )
  }
  renderBody (dates, indexedResources) {
    const {isLoading, resources} = this.props
    const isEmpty = (resources.length === 0)

    if (isLoading) {
      return this.renderLoading()
    }
    if (isEmpty) {
      return this.renderEmpty()
    }

    return this.renderBodyRows(dates, indexedResources)
  }
  render () {
    const {dates, showHeader} = this.props;
    const indexedResources = indexResources(this.props.resources)

    return (
      <div className='hs-scheduler hs-scheduler--week'>
        {showHeader && this.renderHeader(dates)}
        {this.renderBody(dates, indexedResources)}
      </div>
    )
  }
}

Week.propTypes = propTypes

export default Week
