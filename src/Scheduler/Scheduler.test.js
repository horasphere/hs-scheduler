import test from 'tape';
import React from 'react';
import { createRenderer } from 'react-addons-test-utils';

import Scheduler from './Scheduler';
import { mount, unmount } from './../testUtils';


const NOW = new Date();
const RESOURCES = [
    {id: 'resource_1'},
    {id: 'resource_2'}
]

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


test('Scheduler rowRenderer()', (t) => {
    let callCount = 0;

    const rowRenderer = function({key}) {
        callCount++;

        return <div key={key}></div>
    };

    const { node, component } = mount(getScheduler({
        resources: RESOURCES,
        rowRenderer: rowRenderer
    }))



    t.equal(callCount, 2 * RESOURCES.length, 'Should call rowRenderer twice for each resource');

    unmount(node);
    t.end();
})