import React, {Component, PropTypes} from 'react';
import moment from 'moment';

import {resourceShape} from './propTypes';
import {weekComponentsShape} from './propTypes';
import {LOCAL_DATE_FORMAT} from './utils/date';
import {indexResources, getAssignmentsByResourceAndDate} from './utils/resourceHelper';
import SchedulerBody from './SchedulerBody';
import WeekBodyRow from './WeekBodyRow';

const NB_OF_DAYS = 7;

const propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    resources: PropTypes.arrayOf(resourceShape).isRequired,
    weekdayFormat: PropTypes.string.isRequired,
    startOfWeek: PropTypes.oneOf([0, 1, 2, 3, 5, 6]).isRequired,
    showResourcesColumn: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    loading: PropTypes.element.isRequired,
    empty: PropTypes.element.isRequired,
    components: weekComponentsShape
}

class Week extends Component {
    constructor(props) {
        super(props);
    }
    get start() {
        const {date, startOfWeek} = this.props;

        const start = moment(date).day(startOfWeek).format(LOCAL_DATE_FORMAT);

        if(moment(start).isAfter(moment(date).format(LOCAL_DATE_FORMAT))) {
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
        const showResourcesColumn = this.props.showResourcesColumn;
        const HeaderTitle = this.props.components.headerTitle;
        const HeaderWeekday = this.props.components.headerWeekday;

        return (
            <div className="hs-scheduler__header">
                    {(showResourcesColumn)
                        ? <div className="hs-scheduler__header__title">
                            <HeaderTitle />
                            </div>
                        : null
                    }
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
    renderBodyRows(dates, indexedResources) {
        const {showResourcesColumn}= this.props;
        const Assignment = this.props.components.assignment;

        return (
            <div className="hs-scheduler__body">
                {this.props.resources.map((resource) => {
                    return <WeekBodyRow
                            key={resource.id}
                            dates={dates}
                            resource={resource}
                            indexedResources={indexedResources}
                            showResourcesColumn={showResourcesColumn}
                            assignmentComponent={Assignment}
                        />
                })}
            </div>
        )

    }
    renderLoading() {
        const {loading} = this.props;

        return (
            <div className="hs-scheduler__body">
                {loading}
            </div>
        )
    }
    renderEmpty() {
        const {empty} = this.props;

        return (
            <div className="hs-scheduler__body">
                {empty}
            </div>
        )
    }
    renderBody(dates, indexedResources) {
        const {isLoading, resources} = this.props;
        const isEmpty = (resources.length === 0);

        if(isLoading) {
            return this.renderLoading();
        }
        if(isEmpty) {
            return this.renderEmpty();
        }

        return this.renderBodyRows(dates, indexedResources);
    }
    render() {
        const dates = this.dates;
        const indexedResources = indexResources(this.props.resources);

        return (
            <div className="hs-scheduler hs-scheduler--week">
                {this.renderHeader(dates)}
                {this.renderBody(dates, indexedResources)}
            </div>
        )
    }
}

Week.propTypes = propTypes;

export default Week;