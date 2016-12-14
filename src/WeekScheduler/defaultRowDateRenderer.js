import React from 'react'
import moment from 'moment'

export default function({ resource, date, events, isScrolling, isVisible }) {
  if(isScrolling) {
    return <div>...</div>
  }

  return events.map((event) => {
      return <div style={{margin: 5, width: 'calc(100% - 10px)', backgroundColor: '#dcdcdc'}} key={event.id}>{ moment(event.start).format('HH:mm') } - { moment(event.end).format('HH:mm') }</div>
  })
}