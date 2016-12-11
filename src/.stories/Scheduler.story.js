import React, {Component} from 'react';
import { storiesOf, action } from '@kadira/storybook';
import 'react-virtualized/styles.css';

import {Scheduler} from './../Scheduler'



storiesOf('Scheduler grid', module)
    .add('Week view', () => (
        <Scheduler
            rowRenderer={({style}) => {
                return <div style={style}>
                    row
                </div>
            }}
            resources={[{id:'1'}, {id:'2'}]}
            width={300}
            height={300}
            />
    ))