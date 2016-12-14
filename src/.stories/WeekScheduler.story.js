import React, {Component} from 'react';
import { storiesOf, action } from '@kadira/storybook';
import 'react-virtualized/styles.css';
import random from 'lodash/random';
import sample from 'lodash/sample';
import keyBy from 'lodash/keyBy'
import moment from 'moment';

import { WeekScheduler } from './../WeekScheduler'
import { listDates, LOCAL_DATE_FORMAT } from './../utils/date'
import { randomEvent, generateResources, generateEvents } from './helpers'

import './../WeekScheduler/weekscheduler.less'

const NB_RESOURCES = 300;

class Wrapper extends Component {
  constructor(props) {
    super(props);

    const dates = listDates(new Date(), 7)
    const resources = generateResources(NB_RESOURCES)

    this.state = {
      scrollToResource: undefined,
      dates,
      resources,
      events: generateEvents(resources, dates)
    }

    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleScrollTo = this.handleScrollTo.bind(this);
    this.handleScrollToRandom = this.handleScrollToRandom.bind(this);
  }
  handleAdd() {
      const resourceId = this.resourceInput.value
      const localDate = this.dateInput.value

      this.setState({
        events: [
          ...this.state.events,
          randomEvent(resourceId, moment(localDate).toDate())
        ]
      })
  }
  handleRemove() {
    const resourceId = this.resourceInput.value
    const localDate = this.dateInput.value
    const {events} = this.state;

    const filtered = events.filter((event) => {
        return event.resourceId === resourceId && moment(event.start).format(LOCAL_DATE_FORMAT) === localDate;
    })

    const index = events.indexOf(filtered[filtered.length - 1])
    if(index > -1) {
      events.splice(index, 1)
      this.setState({
        events: [...events]
      })
    }

  }
  handleScrollTo() {
    const resourceId = this.resourceInput.value

    this.setState({
      scrollToResource: resourceId
    })
  }
  handleScrollToRandom() {
    this.setState({
      scrollToResource: sample(this.state.resources).id
    })
  }
  render() {

      const {dates, resources, events, scrollToResource} = this.state;

      return <div>
          <div>
            <select defaultValue={resources[0].id} ref={(input) => this.resourceInput = input}>
              {
                resources.map((resource) => {
                  return <option key={resource.id} value={resource.id}>{resource.id}</option>
                })
              }
            </select>
            <select defaultValue={moment(dates[0]).format(LOCAL_DATE_FORMAT)} ref={(input) => this.dateInput = input}>
              {
                dates.map((date) => {
                  const localDate = moment(date).format(LOCAL_DATE_FORMAT)
                  return <option key={localDate} value={localDate}>{localDate}</option>
                })
              }
            </select>
            <button onClick={this.handleAdd}>Add</button>
            <button onClick={this.handleRemove}>Remove</button>
            <button onClick={this.handleScrollTo}>Scroll to</button>
            <button onClick={this.handleScrollToRandom}>Scroll to random</button>
          </div>
          <div>
            <WeekScheduler
              dates={dates}
              resources={resources}
              events={events}
              width={800}
              height={400}
              scrollToResource={scrollToResource}
              />
            </div>
        </div>
    }
}

storiesOf('WeekScheduler', module)
  .add('Basic WeekScheduler with resource column', () => {

    return <Wrapper></Wrapper>
  })