import moment from 'moment';

export const localDateFormat = 'YYYY-MM-DD'

export const compareDates = function(d1, d2) {
    const d1Value = moment(d1).format(localDateFormat);
    const d2Value = moment(d2).format(localDateFormat);

    if(moment(d1Value).isBefore(d2Value))
    {
        return -1;
    }
    else if(moment(d1Value).isAfter(d2Value)) {
        return 1;
    }

    return 0;
}