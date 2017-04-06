import React, {Component} from 'react';
import { storiesOf, action } from '@kadira/storybook';

import sample from 'lodash/sample';
import random from 'lodash/random';
import moment from 'moment';
import names from './names';
import Grid from './../Grid';
import determineDates from './../utils/determine-dates';

import './../Grid/scheduler.less';

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

class WeekView extends Component {
    constructor(props) {
        super(props);

        this.handleShowResourcesChange = this.handleShowResourcesChange.bind(this);
        this.handleResourcesSizeChange = this.handleResourcesSizeChange.bind(this);
        this.generateResources = this.generateResources.bind(this);
        this.handleClearResources = this.handleClearResources.bind(this);
        this.handleToggleLoading = this.handleToggleLoading.bind(this);

        this.state = {
            showResourcesColumn: true,
            resourcesSize: 6,
            resources: generateResources(6),
            isLoading: false
        }
    }
    handleResourcesSizeChange(e) {
        this.setState({
            resourcesSize: parseInt(e.target.value)
        })
    }
    handleShowResourcesChange(e) {
        this.setState({
            showResourcesColumn: !this.state.showResourcesColumn
        })
    }
    generateResources() {
        this.setState({
            resources: generateResources(this.state.resourcesSize)
        })
    }
    handleClearResources() {
        this.setState({
            resources: []
        })
    }
    handleToggleLoading() {
        this.setState({
            isLoading: !this.state.isLoading
        })
    }
    render() {
        return (
            <div>
                <div>
                    <form>
                        <div>
                            <input type="text" value={this.state.resourcesSize} onChange={this.handleResourcesSizeChange} />
                            <button type="button" onClick={this.generateResources}>Generate resources!</button>
                            <a href="javascript:void(0)" onClick={this.handleClearResources}>Clear resources</a>
                        </div>
                        <input type="checkbox" checked={this.state.showResourcesColumn} onChange={this.handleShowResourcesChange} /> Show resources column
                        <br />
                        <input type="checkbox" checked={this.state.isLoading} onChange={this.handleToggleLoading} /> Toggle loading state
                    </form>
                </div>
                <div style={{
                    height: 250
                }}>
                    <Grid
                        resources={this.state.resources}
                        showResourcesColumn={this.state.showResourcesColumn}
                        isLoading={this.state.isLoading}
                        dates={determineDates({
                          date: new Date(2016, 10, 6),
                          startOfWeek: 0,
                          nbOfDays: 7
                        })}
                        />
                </div>
            </div>
        )
    }
}

storiesOf('Scheduler', module)
    .add('Week view', () => (
        <WeekView />
    ))