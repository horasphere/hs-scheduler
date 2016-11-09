import React, {Component, PropTypes} from 'react';
import moment from 'moment';

const propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
    format: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired
}

class DateHeader extends Component {
    constructor(props) {
        super(props);
    }
    get formattedDate() {
        const {date, format} = this.props;

        if(typeof format === 'function') {
            return format(date)
        }

        return moment(date).format(format);
    }
    render() {
        return (
            <span>{this.formattedDate}</span>
        )
    }
}

DateHeader.propTypes = propTypes;

export default DateHeader;