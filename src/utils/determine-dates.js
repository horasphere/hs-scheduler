import moment from 'moment'

import {LOCAL_DATE_FORMAT} from './date'

const NB_OF_DAYS = 7

function determineStart({date, startOfWeek}) {
  const start = moment(date).day(startOfWeek).format(LOCAL_DATE_FORMAT)

  if (moment(start).isAfter(moment(date).format(LOCAL_DATE_FORMAT))) {
    return moment(start).add(-1 * NB_OF_DAYS, 'days')
  }

  return moment(start).toDate()
}


function determineDates(start, nbOfDays) {
  const dates = [start]

  for (var i = 1; i < nbOfDays; i++) {
    dates.push(moment(start).add(i, 'days').toDate())
  }

  return dates
}


/**
 * @param {date} date - Relative to date
 * @param {0-6} startOfWeek - Sunday to Saturday
 * @param {number} nbOfDays -
 */
function dates({date = new Date(), startOfWeek = 0, nbOfDays = NB_OF_DAYS}) {
  const start = determineStart({
    date: date,
    startOfWeek: startOfWeek
  })


  return determineDates(start, nbOfDays)
}

export default dates;