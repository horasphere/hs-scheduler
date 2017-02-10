import React from 'react'
import moment from 'moment'

export default function({ date, headerDateFormatter, style }) {

  const cellStyle = {
    ...style,
    lineHeight: style.height,
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold'
  }

  return <div style={cellStyle}>{ headerDateFormatter(date) }</div>
}