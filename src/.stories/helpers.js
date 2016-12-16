import random from 'lodash/random';
import sample from 'lodash/sample';
import moment from 'moment';
import Chance from 'chance'

const chance = new Chance()

import { listDates, LOCAL_DATE_FORMAT } from './../utils/date'

const MAX_EVENTS = 15;

let eventId = -1;
export function randomEvent(resourceId, date) {
  const localDate = moment(date).format(LOCAL_DATE_FORMAT);

  const startMinutes = random(0, 600);
  const start = moment(`${localDate}T00:00:00`).add(startMinutes, 'minutes').toDate();
  const end = moment(start).add(random(startMinutes, 1440 - startMinutes), 'minutes').toDate();

  eventId++;
  return {
    id: `event_${eventId}`,
    resourceId,
    start,
    end
  }
}

export function generateResources(size) {
  const resources = [];

  for(var i=0; i < size; i++) {
    resources.push({
      id: `resource_${i}`,
      title: chance.name()
    })
  }

  return resources;
}

export function generateEvents(resources, dates) {
  const events = [];

  resources.forEach((resource) => {
    const nbEvents = random(1, MAX_EVENTS)


    for(var i=0; i < nbEvents; i++) {
      events.push(randomEvent(resource.id, sample(dates)))
    }
  })


  return events;
}