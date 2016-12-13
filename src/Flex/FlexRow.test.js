import test from 'tape'
import React from 'react'

import FlexRow from './FlexRow'
import FlexCell from './FlexCell'
import { mount, unmount } from './../testUtils'

test('FlexRow should be configurable', (t) => {
    const {
        node,
        componentNode
    } = mount(<FlexRow className="foo" style={{backgroundColor: 'red'}}>
        <FlexCell width={20} />
        <FlexCell width={80} />
    </FlexRow>)

    t.equal(componentNode.style.backgroundColor, 'red', 'should use :style when specified')
    t.equal(componentNode.className, 'foo', 'should use :className when specified')
    t.equal(componentNode.children.length, 2, 'should render children')

    unmount(node);
    t.end();
})