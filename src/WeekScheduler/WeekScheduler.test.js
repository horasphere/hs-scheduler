import test from 'tape'
import React from 'react'
import moment from 'moment'

import WeekScheduler from './WeekScheduler'
import { LOCAL_DATE_FORMAT } from './../utils/date'
import { mount, unmount } from './../testUtils'

function getWeekScheduler (props = {}) {
  return (
    <WeekScheduler
      dates={[]}
      resources={[]}
      events={[]}
      width={300}
      height={300}
      {...props}
      />
  )
}

test('should accept :headerDateRenderer as props', (t) => {
  const today = new Date()

  let headerDateRendererCalled = false
  let options
  const { node, componentNode } = mount(getWeekScheduler({
    dates: [ today ],
    headerDateRenderer: (_options) => {
      headerDateRendererCalled = true
      options = _options

      return <div />
    }
  }))

  const {
    date
    } = options

  t.ok(headerDateRendererCalled, 'should call :headerDateRenderer')
  t.equal(moment(date).format(LOCAL_DATE_FORMAT), moment(today).format(LOCAL_DATE_FORMAT), ':date params should be defined')
  t.equal(componentNode.querySelectorAll('.hs-scheduler--week__header__date').length, 1, 'should render all header dates')

  unmount(node)
  t.end();
})

test('should accept :rowDateRenderer as props', (t) => {
  const today = new Date()
  const tomorrow = moment(today).add(1, 'days').toDate()

  const resources = [{id: 'r1', title: 't1'}]
  const events = [
    {id: 'e1', resourceId: 'r1', start: today, end: today },
    {id: 'e2', resourceId: 'r2', start: today, end: today },
    {id: 'e3', resourceId: 'r1', start: tomorrow, end: tomorrow }
  ]

  let rowDateRendererCalled = false
  let options
  const { node, componentNode } = mount(getWeekScheduler({
    dates: [ today ],
    resources,
    events,
    rowDateRenderer: (_options) => {
      rowDateRendererCalled = true
      options = _options

      return <div />
    }
  }))

  const {
    date,
    resource,
    events: currentEvents,
    isScrolling,
    isVisible
    } = options

  t.ok(rowDateRendererCalled, 'should call :rowDateRendererCalled')
  t.equal(moment(date).format(LOCAL_DATE_FORMAT), moment(today).format(LOCAL_DATE_FORMAT), ':date params should be defined')
  t.equal(resource, resources[0], ':resource params should be defined')
  t.equal(currentEvents.length, 1, ':events params should be defined')
  t.equal(currentEvents[0].id, 'e1', ':events should be filterd according to date and resource')
  t.equal(isScrolling, false, ':isScrolling params should be defined')
  t.equal(isVisible, true, ':isVisible params should be defined')
  t.equal(componentNode.querySelectorAll('.hs-scheduler--week__row__date').length, 1, 'should render all row dates')

  unmount(node)
  t.end();
})