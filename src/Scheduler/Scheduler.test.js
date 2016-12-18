import test from 'tape'
import React from 'react'

import Scheduler from './Scheduler'
import { mount, unmount, render } from './../testUtils'

function getScheduler (props = {}) {
  return (
    <Scheduler
      events={[]}
      width={300}
      height={300}
      headerResourceRenderer={() => (null)}
      headerContentRenderer={() => (null)}
      rowResourceRenderer={() => (null)}
      rowContentRenderer={() => (null)}
      footerResourceRenderer={() => (null)}
      footerContentRenderer={() => (null)}
      {...props}
      />
  )
}

test('Scheduler rowRenderer()', (t) => {
  const resources = [{id: 'r1', title: 't1'}]
  const events = [{id: 'e1', resourceId: 'r1', start: new Date(), end: new Date()}]

  let rowResourceRendererCalled = false
  let rowContentRendererCalled = false
  let options
  const { node, componentNode } = mount(getScheduler({
    resources: resources,
    events: events,
    rowClassName: 'foo',
    rowResourceRenderer: function () {
      rowResourceRendererCalled = true
      return null
    },
    rowContentRenderer: function (_options) {
      rowContentRendererCalled = true
      options = _options
      return null
    }
  }))

  t.ok(componentNode.querySelectorAll('.hs-scheduler__row')[0].className.indexOf('foo') > -1, 'should use :rowClassName if specified')
  t.ok(rowResourceRendererCalled, 'should call :rowResourceRenderer if specified')
  t.ok(rowContentRendererCalled, 'should call :rowContentRenderer if specified')

  t.equal(options.resource.id, 'r1', ':isScrolling param should be defined')
  t.equal(options.isScrolling, false, ':isScrolling param should be defined')
  t.equal(options.isVisible, true, ':isVisible param should be defined')

  unmount(node)
  t.end()
})

test('Scheduler noResourcesRenderer()', (t) => {
  let called = false
  const { node } = mount(getScheduler({
    resources: [],
    events: [],
    noResourcesRenderer: () => {
      called = true
      return null
    }
  }))

  t.ok(called, ':noResourcesRenderer should be called')

  unmount(node)
  t.end()
})

test('should be able to hide resource column', (t) => {
  const { node, componentNode } = mount(getScheduler({
    resources: [{id: '1', title: 't1'}],
    events: [],
    resourceVisible: false
  }))

  t.equal(componentNode.querySelector('.hs-scheduler__header').children.length, 1, 'content only should be renderer in header')
  t.equal(componentNode.querySelector('.hs-scheduler__row').children.length, 1, 'content only should be renderer in rows')
  t.equal(componentNode.querySelector('.hs-scheduler__footer').children.length, 1, 'content only should be renderer in footer')

  unmount(node)
  t.end()
})

test('should be able to customize Header', (t) => {
  let headerResourceRendererCalled = false
  let headerContentRendererCalled = false
  const { node, componentNode } = mount(getScheduler({
    resources: [],
    events: [],
    headerClassName: 'foo',
    headerResourceRenderer: () => {
      headerResourceRendererCalled = true
      return null
    },
    headerContentRenderer: () => {
      headerContentRendererCalled = true
      return null
    }
  }))

  t.ok(componentNode.querySelector('.hs-scheduler__header').className.indexOf('foo') > -1, 'should use :headerClassName if specified')
  t.ok(headerResourceRendererCalled, 'should call :headerResourceRenderer if specified')
  t.ok(headerContentRendererCalled, 'should call :headerContentRenderer if specified')

  unmount(node)
  t.end()
})

test('should be able to customize Footer', (t) => {
  let footerResourceRendererCalled = false
  let footerContentRendererCalled = false
  const { node, componentNode } = mount(getScheduler({
    resources: [],
    events: [],
    footerResourceRenderer: () => {
      footerResourceRendererCalled = true
      return null
    },
    footerContentRenderer: () => {
      footerContentRendererCalled = true
      return null
    }
  }))

  t.ok(componentNode.querySelectorAll('.hs-scheduler__footer')[0].className.indexOf('foo') > -1, 'should use :footerClassName if specified')
  t.ok(footerResourceRendererCalled, 'should call :footerResourceRenderer if specified')
  t.ok(footerContentRendererCalled, 'should call :footerContentRenderer if specified')

  unmount(node)
  t.end()
})

test('should be able to hide Footer', (t) => {
  const { node, componentNode } = mount(getScheduler({
    resources: [],
    events: [],
    footerVisible: false
  }))

  t.equal(componentNode.querySelectorAll('.hs-scheduler__footer').length, 0, 'should not show footer if :footerVisible is specified')

  unmount(node)
  t.end()
})

test('should not re-render unless props have changed', (t) => {
  let rowResourceRendererCalled = false;
  const params = {
    resources: [{id: 'r1', title: 't1'}],
    events: [],
    rowResourceRenderer: function () {
      rowResourceRendererCalled = true
      return null
    }
  }

  const { node, componentNode } = mount(getScheduler(params))

  t.ok(rowResourceRendererCalled, 'should render');

  rowResourceRendererCalled = false
  render(getScheduler(params), node)
  t.equal(rowResourceRendererCalled, false, 'should not re-render');

  unmount(node)
  t.end()
})

test('should search and find matching resources', (t) => {

  let _matches = null;
  let _searchQuery = null;
  const params = {
    resources: [{id: 'r1', title: 'title 1 foo'}, {id: 'r2', title: 'title 2 bar'}, {id: 'r3', title: 'title 3 foo'}],
    events: [],
    searchFinished: ({matches, searchQuery}) => {
        _matches = matches;
        _searchQuery = searchQuery
    }
  }

  const { node, componentNode } = mount(getScheduler({...params, searchQuery: null}))

  t.equal(_matches.length, 0, 'when search query is null should have no matches');

  render(getScheduler({...params, searchQuery: 'bar'}), node)
  t.equal(_matches.length, 1, 'should find (1) matches');

  render(getScheduler({...params, searchQuery: 'foo'}), node)
  t.equal(_matches.length, 2, 'should find multiple matches');

  unmount(node)
  t.end()
})

test('should accept custom search method', (t) => {
  let _matches = null;
  let _searchQuery = null;
  const params = {
    resources: [{id: 'r1', title: 'title 1 foo'}, {id: 'r2', title: 'title 2 bar'}, {id: 'r3', title: 'title 3 foo'}],
    events: [],
    searchFinished: ({matches, searchQuery}) => {
      _matches = matches;
      _searchQuery = searchQuery
    }
  }

  const startWithSearchMethod = ({resource, searchQuery}) => (resource.title.indexOf(searchQuery) === 0);
  const { node, componentNode } = mount(getScheduler({...params, searchQuery: 'foo', searchMethod: startWithSearchMethod}))
  t.equal(_matches.length, 0, 'should not matche any resources');

  render(getScheduler({...params, searchQuery: 'title'}), node)
  t.equal(_matches.length, 3, 'should find multiple matches');

  unmount(node)
  t.end()
})