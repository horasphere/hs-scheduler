import React, {Component, PropTypes} from 'react';
import moment from 'moment';

import { FlexRow, FlexCell } from './../Flex'
import { Quart } from './../Quart'
import { listDates, LOCAL_DATE_FORMAT } from './../utils/date'

const propTypes = {

}

const defaultProps = {

}

class SchedulerRow extends Component {
    render() {
        const {resource, dates, events, index} = this.props;

        return (
          <FlexRow key={resource.id} style={{backgroundColor: (index % 2 === 0) ? 'transparent' : '#DDD'}}>
            <FlexCell width={20} style={{backgroundColor: 'red', opacity: 0.2}}>
              {resource.id}
            </FlexCell>
            <FlexCell width={80}>
              <FlexRow>
                {
                  dates.map((date, idx) => {
                    const localDate = moment(date).format(LOCAL_DATE_FORMAT)
                    const filtered = events.filter((event) => {
                      return event.resourceId === resource.id && moment(event.start).format(LOCAL_DATE_FORMAT) === localDate
                    })
                    return <FlexCell key={localDate} width={100 / dates.length} style={{backgroundColor: (idx % 2 === 0) ? 'transparent' : 'blue', opacity: (idx % 2 === 0) ? 1 : 0.2}}>
                      {
                        filtered.map((event) => (
                          <Quart start={event.start} end={event.end} />
                        ))
                      }
                    </FlexCell>
                  })

                }
              </FlexRow>
            </FlexCell>
          </FlexRow>
        )
    }
}

SchedulerRow.propTypes = propTypes;
SchedulerRow.defaultProps = defaultProps;

export default SchedulerRow;