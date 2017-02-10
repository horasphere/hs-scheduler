import React from 'react'
import moment from 'moment'

export default function({ date }) {

  return moment(date).format('ddd D MMM').toUpperCase();
}