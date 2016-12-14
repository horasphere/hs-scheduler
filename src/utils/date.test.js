import moment from 'moment'
import test from 'tape'

import { startOfWeekDate, LOCAL_DATE_FORMAT } from './date'

test('shoud determine start date of week', (t) => {
  const tueDec13 = new Date(2016, 11, 13);

  t.equal(startOfWeekDate(tueDec13, 0).getDate(), 11, 'for Tuesday current start of week should be the previous Sunday')
  t.equal(startOfWeekDate(tueDec13, 2).getDate(), 13, 'current date is start of week')

  t.end()
})