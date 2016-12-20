import React, {Component} from 'react';
import moment from 'moment';
import shallowCompare from 'react-addons-shallow-compare'


import './hora.less'

class Quart extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }
  render() {

    return (
      <div className="h-quart-block">

        <div className="h-quart-block-header">
          <span className="type-icon"><i className="fa fa-thumbs-up"></i></span>
                        <span className="title"
                              title="A17_126_AMB Romulus Wilfrance">A17_126_AMB Romulus Wilfrance</span>
          <span className="total-hour">(8.5)</span>
          <span className="source-icon"><i className="fa fa-chain"></i></span></div>

        <div className="h-quart-block-body">
          <div className="h-assignation-wrapper">

            <div className="h-assignation-block-wrapper WORK" style={{borderLeftColor: "#ffffff"}}>
              <div className="period">
                <span className="hours"> {moment(this.props.start).format('h:mm')}
                  - {moment(this.props.end).format('h:mm')}</span>
                <span className="total">(8.5)</span>
              </div>

    <span className="flex-container"><div className="affectation ">Ambassadeur</div><span
      className="h-quart-block-footer-toolbar flex-container shrink-footer"><div className="pull-left">
      <div className="badge-container flex-container">
      </div>
    </div>

    <div className="pull-right">
      <div className="more-action dropdown-toggle" data-toggle="dropdown">
        <i className="fa fa-gear" style={{marginRight: 2}}></i>
        <i className="fa fa-caret-down"></i>
      </div>
      <ul className="dropdown-menu dropdown-menu-right" style={{fontSize: "1.1em"}} role="menu">
        <li className="quart-action-replacement-pool">
          <a href="javascript:void(0)"><i className="fa fa-fw fa-exchange"></i> Send to replacements</a></li>
        <li className="quart-action-reassign">
          <a href="javascript:void(0)"><i className="fa fa-fw fa-exchange"></i> Reassign...</a></li>
        <li className="quart-action-task">
          <a href="javascript:void(0)"><i className="fa fa-fw fa-sticky-note"></i> Task...</a></li>
        <li className="quart-action-reschedule">
          <a href="javascript:void(0)"><i className="fa fa-fw fa-clock-o"></i> Reschedule...</a></li>
        <li className="quart-action-cut">
          <a href="javascript:void(0)"><i className="fa fa-fw fa-clock-o"></i> Split...</a></li>
        <li className="quart-action-quart-to-absence">
          <a href="javascript:void(0)"><i className="fa fa-fw "></i> Absence...</a></li>
        <li className="divider"></li>
        <li className="quart-action-unassign">
          <a href="javascript:void(0)"><i className="fa fa-fw fa-times"></i> Unassign</a></li>
      </ul>
    </div>
</span></span>

            </div>
          </div>

          <div className="h-task-wrapper">
            <ul className="fa-ul">

            </ul>
          </div>
        </div>

      </div>
    )
  }
}
export default Quart;