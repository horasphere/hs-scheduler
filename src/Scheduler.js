import React, {Component, PropTypes} from 'react';
import WeekView from './WeekView';
import extend from 'lodash/extend';

import DateHeader from './DateHeader';
import {resourceShape, weekComponentsShape} from './propTypes';

const propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    resources: PropTypes.arrayOf(resourceShape).isRequired,
    view: PropTypes.oneOf(['week']).isRequired,
    weekdayFormat: PropTypes.string.isRequired,
    startOfWeek: PropTypes.oneOf([0, 1, 2, 3, 5, 6]).isRequired, //(Sunday to Saturday)
    components: PropTypes.shape({
        week: weekComponentsShape
    })
}

const defaultProps = {
    date: new Date(),
    view: 'week',
    weekdayFormat: 'ddd D MMM',
    startOfWeek: 0,
    components: {
        week: {
            headerTitle: function(props) {
                return null;
            },
            headerWeekday: function(props) {
                return <DateHeader date={props.date} format={props.weekdayFormat} />
            }
        }
    }
}

class Scheduler extends Component {
    constructor(props) {
        super(props);
    }
    renderWeekView() {
        return (
            <WeekView
                date={this.props.date}
                startOfWeek={this.props.startOfWeek}
                weekdayFormat={this.props.weekdayFormat}
                resources={this.props.resources}
                components={extend({}, defaultProps.components.week, this.props.components.week)}
            />
        )
    }
    render() {
        const {view} = this.props;

        if(view === 'week') {
            return this.renderWeekView();
        }

        throw new Error('Unknown view....' + view)
    }
}

Scheduler.propTypes = propTypes;
Scheduler.defaultProps = defaultProps;

export default Scheduler;