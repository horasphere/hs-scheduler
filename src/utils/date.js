import moment from 'moment'

export const LOCAL_DATE_FORMAT = 'YYYY-MM-DD'

export function localDate(date) {
  return moment(date).format(LOCAL_DATE_FORMAT);
}

export function compareDates(d1, d2) {
  const d1Value = moment(d1).format(LOCAL_DATE_FORMAT)
  const d2Value = moment(d2).format(LOCAL_DATE_FORMAT)

  if (moment(d1Value).isBefore(d2Value)) {
    return -1
  } else if (moment(d1Value).isAfter(d2Value)) {
    return 1
  }

  return 0
}


export function startOfWeekDate(date, startOfWeek) {
  const start = moment(date).day(startOfWeek).format(LOCAL_DATE_FORMAT)

  if (moment(start).isAfter(moment(date).format(LOCAL_DATE_FORMAT))) {
    return moment(start).add(-1 * 7, 'days')
  }

  return moment(start).toDate()
}

export function listDates(start, length) {
  const dates = [start]

  for (var i = 1; i < length; i++) {
    dates.push(moment(start).add(i, 'days').toDate())
  }

  return dates
}