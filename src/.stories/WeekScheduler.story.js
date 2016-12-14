import React, {Component} from 'react';
import { storiesOf, action } from '@kadira/storybook';
import 'react-virtualized/styles.css';
import random from 'lodash/random';
import sample from 'lodash/sample';
import moment from 'moment';

import { WeekScheduler } from './../WeekScheduler'
import { listDates, LOCAL_DATE_FORMAT } from './../utils/date'

import './../WeekScheduler/weekscheduler.less'

const MAX_EVENTS = 15;

function randomRange(dates) {
  const localDate = moment(sample(dates)).format(LOCAL_DATE_FORMAT);

  const start = moment(`${localDate}T00:00:00`).add(random(0, 1400), 'minutes').toDate();
  const end = moment(start).add(random(0, 1400), 'minutes').toDate();

  return {
    start,
    end
  }
}

function generateResource(size) {
  const resources = [];

  for(var i=0; i < size; i++) {
    resources.push({id: `resource_${i}`})
  }

  return resources;
}

function generateEvents(resources, dates) {
  let id = 0;
  const events = [];

  resources.forEach((resource) => {
    const nbEvents = random(1, MAX_EVENTS)


    for(var i=0; i < nbEvents; i++) {
      const { start, end } = randomRange(dates)
      events.push({
          id: `event_${id}`,
          resourceId: resource.id,
          start,
          end
      })

      id++;
    }
  })


  return events;
}

const dates = listDates(new Date(), 7);
const resources = generateResource(100);
const events = generateEvents(resources, dates)

storiesOf('WeekScheduler', module)
  .add('Basic WeekScheduler with resource column', () => {


    //console.log('dates', dates)
    //console.log('resources', resources)
    //console.log('events', events)

    return <WeekScheduler
      dates={dates}
      resources={resources}
      events={events}
      width={800}
      height={600}
      />
  })