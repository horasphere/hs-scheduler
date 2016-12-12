import moment from 'moment'

export const LOCAL_DATE_FORMAT = 'YYYY-MM-DD'

export const compareDates = function (d1, d2) {
  const d1Value = moment(d1).format(LOCAL_DATE_FORMAT)
  const d2Value = moment(d2).format(LOCAL_DATE_FORMAT)

  if (moment(d1Value).isBefore(d2Value)) {
    return -1
  } else if (moment(d1Value).isAfter(d2Value)) {
    return 1
  }

  return 0
}
