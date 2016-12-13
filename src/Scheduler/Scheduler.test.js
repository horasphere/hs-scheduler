import test from 'tape'
import React from 'react'

import Scheduler from './Scheduler'
import { mount, unmount } from './../testUtils'

function getScheduler (props = {}) {
  return (
    <Scheduler
      date={new Date()}
      events={[]}
      width={300}
      height={300}
      rowRenderer={() => (<div></div>)}
      {...props}
            />
  )
}

test('Scheduler rowRenderer()', (t) => {
  const resources = [{id: 'r1'}]
  const events = [{id: 'e1', start: new Date(), end: new Date()}]

  let callCount = 0
  let options
  const rowRenderer = function (_options) {
    callCount++
    options = _options

    return <div key={_options.key} />
  }

  const { node } = mount(getScheduler({
    resources: resources,
    events: events,
    rowRenderer: rowRenderer
  }))

  t.equal(callCount, 2 * resources.length, 'should call :rowRenderer twice for each resource')

  const {
      style,
      index,
      resource,
      resourceById,
      eventById,
      isScrolling,
      isVisible,
      key
  } = options

  t.ok(style, ':style params should be defined')
  t.equal(0, index, ':index should be defined')
  t.equal(resources[0], resource, ':resource should be defined')
  t.deepEqual({r1: resources[0]}, resourceById, ':resourceById should be defined')
  t.deepEqual({e1: events[0]}, eventById, ':eventById should be defined')
  t.equal(false, isScrolling, ':isScrolling should be defined')
  t.equal(true, isVisible, ':isVisible should be defined')
  t.equal('0-0', key, ':key should be defined')

  unmount(node)
  t.end()
})

test('Scheduler noResourcesRenderer()', (t) => {
    let called = false;
    const { node } = mount(getScheduler({
        resources: [],
        events: [],
        noResourcesRenderer: (() => {
            called = true;
            return null;
        })
    }))

    t.ok(called, ':noResourcesRenderer should be called')

    unmount(node)
    t.end()
})

test('should be able to customize Header', (t) => {
    let headerRendererCalled = false;
    const { node, componentNode } = mount(getScheduler({
        resources: [],
        events: [],
        headerClassName: 'foo',
        headerRenderer: () => {
            headerRendererCalled = true
            return null;
        },
    }))

    t.ok(componentNode.querySelectorAll('.hs-scheduler__header')[0].className.indexOf('foo') > -1, 'should use :headerClassName if specified')
    t.ok(headerRendererCalled, 'should call :headerRenderer if specified')

    unmount(node)
    t.end()
})

test('should be able to customize Footer', (t) => {
    let footerRendererCalled = false;
    let { node, componentNode } = mount(getScheduler({
        resources: [],
        events: [],
        footerClassName: 'foo',
        footerRenderer: () => {
            footerRendererCalled = true
            return null;
        },
    }))

    t.ok(componentNode.querySelectorAll('.hs-scheduler__footer')[0].className.indexOf('foo') > -1, 'should use :footerClassName if specified')
    t.ok(footerRendererCalled, 'should call :footerRenderer if specified')

    unmount(node)
    t.end()
})

test('should be able to hide Footer', (t) => {
    let { node, componentNode } = mount(getScheduler({
        resources: [],
        events: [],
        footerVisible: false
    }))

    t.equal(componentNode.querySelectorAll('.hs-scheduler__footer').length, 0, 'should not show footer if :footerVisible is specified')

    unmount(node)
    t.end()
})


test('should use a custom renderer if specified', (t) => {
    let headerRendererCalled = false;
    let footerRendererCalled = false;
    const { node } = mount(getScheduler({
        resources: [],
        events: [],
        headerRenderer: () => {
            headerRendererCalled = true
            return null;
        },
        footerRenderer: () => {
            footerRendererCalled = true
            return null;
        }
    }))

    t.ok(headerRendererCalled, 'should call :headerRenderer if specified')
    t.ok(footerRendererCalled, 'should call :footerRenderer if specified')

    unmount(node)
    t.end()
})



