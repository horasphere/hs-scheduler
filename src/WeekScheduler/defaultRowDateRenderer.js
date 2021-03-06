import React from 'react'
import moment from 'moment'


export default function({ resource, date, events, isScrolling, isVisible }) {
  let child = null;

  if(isScrolling) {
    child = (<div style={{position: 'relative'}}>
      {
        events.map((event, index) => {
          //return <Quart key={event.id} start={event.start} end={event.end} />
          return <div key={event.id} style={{
            margin: 5,
            height: 50,
            position: 'absolute',
            top: index * 55,
            left: 0,
            width: 'calc(100% - 10px)'
          }}>
            <div className="placeholder-quart">
              <div className="animated-background">
                <div className="mask h-separator-1"></div>
                <div className="mask h-separator-2"></div>
                <div className="mask h-separator-3"></div>
                <div className="mask v-separator"></div>
                <div className="mask block-1"></div>
                <div className="mask block-2"></div>
                <div className="mask block-3"></div>
                <div className="mask block-4"></div>
              </div>
            </div>
          </div>
        })
      }
    </div>)
  }
  else {
    return events.map((event) => {
      return <div style={{margin: 5, width: 'calc(100% - 10px)', backgroundColor: '#dcdcdc'}} key={event.id}>{ moment(event.start).format('HH:mm') } - { moment(event.end).format('HH:mm') }</div>
    })
  }
}