import React, { Component } from 'react'

class SchedulerBody extends Component {
  render () {
    return (
      <div className='hs-scheduler__body'>
        {this.props.children}
      </div>
    )
  }
}

export default SchedulerBody
