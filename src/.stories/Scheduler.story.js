import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import sample from 'lodash/sample';
import random from 'lodash/random';
import moment from 'moment';
import names from './names';
import Scheduler from './../';
import './legacy.less';
import './../scheduler.less';

var legacyHtml = require("raw!./LegacyScheduler.html");

const dates = [
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12'
]

const randomRange = () => {
    const day = sample(dates);

    const start = moment(`2016-11-${day}T00:00:00`).add(random(0, 1400), 'minutes').toDate();
    const end = moment(start).add(random(0, 1400), 'minutes').toDate();

    return {
        start,
        end
    }
}

const generateResources = (size) => {
    let assignmentId = size + 1;

    const resources = [];
    for(var i=0; i < size; i++) {

        const count = random(0, 3);
        const assignments = [];
        for(var j=0; j < count; j++)
        {
            const range = randomRange();
            assignments.push({
                id: assignmentId++,
                start: range.start,
                end: range.end
            })
        }
        resources.push({
            id: i,
            name: sample(names).name,
            assignments
        })
    }

    return resources;
}

storiesOf('Scheduler', module)
    .add('with text', () => (
        <div style={{
            height: 250
        }}>
            <Scheduler
                resources={generateResources(2)}
                startOfWeek={0}
                />
        </div>
    ))
    .add('legacy', () => (
        <div dangerouslySetInnerHTML={{ __html: legacyHtml }}></div>
    ))