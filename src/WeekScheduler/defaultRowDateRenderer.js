import React from 'react'
import moment from 'moment'

import {Quart} from './../Quart'


export default function({ resource, date, events, isScrolling, isVisible }) {
  if(isScrolling) {
    return <div>...</div>
      //return <div key={event.id} style={{margin: 5, width: 'calc(100% - 10px)'}}>
      //    <Quart
      //      start={event.start}
      //      end={event.start} />
      //
      //  </div>
  }
  return events.map((event) => {
    return <div style={{margin: 5, width: 'calc(100% - 10px)', backgroundColor: '#dcdcdc'}} key={event.id}>{ moment(event.start).format('HH:mm') } - { moment(event.end).format('HH:mm') }</div>
  })
}