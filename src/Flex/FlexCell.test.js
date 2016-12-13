import test from 'tape'
import React from 'react'

import FlexRow from './FlexRow'
import FlexCell from './FlexCell'
import { mount, unmount } from './../testUtils'

test('FlexCell should be configurable', (t) => {
    const {
        node,
        componentNode
    } = mount(<FlexCell className="foo" style={{backgroundColor: 'red'}} width={20}>
        <div></div>
        <div></div>
        <div></div>
    </FlexCell>)

    t.equal(componentNode.style.backgroundColor, 'red', 'should use :style when specified')
    t.equal(componentNode.style.flex, '1 1 20%', 'flex should be set according to :width')
    t.equal(componentNode.className, 'foo', 'should use :className when specified')
    t.equal(componentNode.children.length, 3, 'should render children')

    unmount(node);
    t.end();
})