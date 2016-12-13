import React, { Component } from 'react'

import { Scheduler } from './../Scheduler'

const propTypes = {

}

const defaultProps = {

}

class WeekScheduler extends Component {
  render () {
    return (
      <Scheduler />
    )
  }
}

WeekScheduler.propTypes = propTypes
WeekScheduler.defaultProps = defaultProps

export default WeekScheduler
