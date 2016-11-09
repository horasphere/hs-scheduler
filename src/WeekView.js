import React, {Component, PropTypes} from 'react';
import moment from 'moment';

import {resourceShape} from './propTypes';
import {weekComponentsShape} from './propTypes';
import {localDateFormat} from './utils/date';
import {indexResources, getAssignmentsByResourceAndDate} from './utils/resourceHelper';
import Quart from './Quart';
const NB_OF_DAYS = 7;

const propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    resources: PropTypes.arrayOf(resourceShape).isRequired,
    weekdayFormat: PropTypes.string.isRequired,
    startOfWeek: PropTypes.oneOf([0, 1, 2, 3, 5, 6]).isRequired,
    components: weekComponentsShape
}

class Week extends Component {
    constructor(props) {
        super(props);
    }
    get start() {
        const {date, startOfWeek} = this.props;

        const start = moment(date).day(startOfWeek).format(localDateFormat);

        if(moment(start).isAfter(moment(date).format(localDateFormat))) {
            return moment(start).add(-1 * NB_OF_DAYS, 'days');
        }

        return moment(start).toDate();
    }
    get dates() {
        const start = this.start;
        const dates = [start];

        for(var i=1; i < NB_OF_DAYS; i++) {
            dates.push(moment(start).add(i, 'days').toDate())
        }

        return dates;
    }
    renderHeader(dates) {
        const HeaderTitle = this.props.components.headerTitle;
        const HeaderWeekday = this.props.components.headerWeekday;

        return (
            <div className="hs-scheduler__header">
                    <div className="hs-scheduler__header__title">
                        <HeaderTitle />
                    </div>
                    {dates.map((date) => {
                        const key = moment(date).format('D-M-YY');
                        return <div className="hs-scheduler__header__date" key={key}>
                            <HeaderWeekday
                                date={date}
                                weekdayFormat={this.props.weekdayFormat}
                                />
                        </div>
                    }, this)}
            </div>
        )
    }
    renderWeekday(resourceId, date, indexedResources) {
        const assignments = getAssignmentsByResourceAndDate(resourceId, date, indexedResources);

        return (
            <div className="hs-scheduler__body__row__date">
                {assignments.map((assignment) => {
                    return <Quart />
                })}
            </div>
        )
    }
    render() {
        const dates = this.dates;
        const indexedResources = indexResources(this.props.resources);

        console.log(indexedResources);
        return (
            <div className="hs-scheduler">
                {this.renderHeader(dates)}
                <div className="hs-scheduler__body">
                    {this.props.resources.map((resource) => {
                        const {id, name} = resource;

                        return (
                            <div className="hs-scheduler__body__row" key={id}>
                                <div className="hs-scheduler__body__row__title">{name}</div>
                                {this.dates.map((date) => {
                                    return this.renderWeekday(id, date, indexedResources);
                                }, this)}
                            </div>
                        )
                    }, this)}
                </div>
            </div>
        )
    }
}

Week.propTypes = propTypes;

export default Week;