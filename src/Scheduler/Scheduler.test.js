import test from 'tape';
import sinon from 'sinon';
import React from 'react';
import { createRenderer } from 'react-addons-test-utils';

import Scheduler from './Scheduler';

const NOW = new Date();
const RESOURCES = [
    {id: 'resource_1'},
    {id: 'resource_2'}
]

function headerRenderer() {
    return <div></div>
}

//function rowRenderer({ resource }) {
//    return <div key={resource.id}></div>
//}

function getScheduler(props = {}) {
    return (
        <Scheduler
            date={NOW}
            events={[]}
            width={300}
            height={300}
            {...props}
            />
    )
}

//test('Scheduler headerRenderer()', (t) => {
//
//    const headerRenderer = sinon.spy();
//
//    const renderer = createRenderer();
//    renderer.render(getScheduler({
//        headerRenderer: headerRenderer,
//    }));
//
//    t.ok(headerRenderer.calledOnce, 'should be called once');
//    t.deepEqual(headerRenderer.getCall(0).args[0], {
//        date: NOW
//    }, 'params should be set')
//
//    t.end();
//})

import ReactDOM from 'react-dom'

/**
 * Helper method for testing components that may use Portal and thus require cleanup.
 * This helper method renders components to a transient node that is destroyed after the test completes.
 * Note that rendering twice within the same test method will update the same element (rather than recreate it).
 */
export function render (markup) {
    if (!render._mountNode) {
        render._mountNode = document.createElement('div')

        // Unless we attach the mount-node to body, getBoundingClientRect() won't work
        document.body.appendChild(render._mountNode)

        afterEach(render.unmount)
    }

    return ReactDOM.render(markup, render._mountNode)
}

/**
 * The render() method auto-unmounts components after each test has completed.
 * Use this method manually to test the componentWillUnmount() lifecycle method.
 */
render.unmount = function () {
    if (render._mountNode) {
        ReactDOM.unmountComponentAtNode(render._mountNode)

        document.body.removeChild(render._mountNode)

        render._mountNode = null
    }
}


test('Scheduler rowRenderer()', (t) => {

    const rowRenderer = sinon.spy();

    const renderer = createRenderer();
    render(getScheduler({
        resources: RESOURCES,
        rowRenderer: rowRenderer
    }));

    t.equal(rowRenderer.callCount, RESOURCES.length, 'should be called for each resource');
    //t.deepEqual(rowRenderer.getCall(0).args[0], {
    //    date: NOW,
    //    resource: RESOURCES[0]
    //}, 'params should be set')

    t.end();
})