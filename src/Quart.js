import React, {Component, PropTypes} from 'react';

const propTypes = {

}

const defaultProps = {

}

class Quart extends Component {
    constructor(props) {
        super(props);
    }
    footer() {
        <div className="h-quart-block-footer-toolbar clearfix">
            <div className="pull-left">
                <div className="badge-container flex-container"></div>
            </div>

            <div className="pull-right">
                <div className="more-action dropdown-toggle" data-toggle="dropdown">
                    <i className="fa fa-gear" style={{marginRight: 2}}></i>
                    <i className="fa fa-caret-down"></i>
                </div>
                <ul className="dropdown-menu dropdown-menu-right" style={{fontSize:"1.1em"}} role="menu">
                    <li className="quart-action-replacement-pool">
                        <a href="javascript:void(0)"><i className="fa fa-fw fa-exchange"></i> Remplacement libre</a> </li><li className="quart-action-reassign">
                    <a href="javascript:void(0)"><i className="fa fa-fw fa-exchange"></i> Réassigner...</a> </li><li className="quart-action-task">
                    <a href="javascript:void(0)"><i className="fa fa-fw fa-sticky-note"></i> Tâche...</a> </li><li className="quart-action-reschedule">
                    <a href="javascript:void(0)"><i className="fa fa-fw fa-clock-o"></i> Replanifier...</a> </li><li className="quart-action-cut">
                    <a href="javascript:void(0)"><i className="fa fa-fw fa-clock-o"></i> Fractionner...</a> </li><li className="quart-action-quart-to-absence">
                    <a href="javascript:void(0)"><i className="fa fa-fw "></i> Absence...</a> </li><li className="divider"></li><li className="quart-action-unassign">
                    <a href="javascript:void(0)"><i className="fa fa-fw fa-times"></i> Désassigner</a> </li></ul>
            </div>
        </div>
    }
    render() {
        return (
            <div data-modelcid="c8325" className="h-quart-block-wrapper" data-role="draggable"><div className="h-inconsistency-icons text-right">
    <span className="h-warning-tooltip-wrapper">
        <span className="inconsistency-warning hide" data-toggle="tooltip" data-html="true"><i className="fa fa-fw fa-exclamation-triangle"></i></span>
    </span>
    <span className="h-error-tooltip-wrapper">
        <span className="inconsistency-error  hide" data-toggle="tooltip" data-html="true"><i className="fa fa-fw fa-exclamation"></i></span>
    </span>
            </div>
                <div className="h-quart-block">

                    <div className="h-quart-block-header">
                        <span className="type-icon"><i className="fa fa-cube"></i></span>
                        <span className="title" title="Diane Diane ">Diane Diane </span>
                        <span className="total-hour">(0,02)</span>
                        <span className="source-icon"><i className="fa fa-chain"></i></span></div>

                    <div className="h-quart-block-body"><div className="h-assignation-wrapper">

                        <div className="h-assignation-block-wrapper WORK" style={{borderLeftColor: "#ff7f27"}}>
                            <div className="period">
                                <span className="hours"> 01:00 01:01</span>
                                <span className="total">(0,02)</span>
                            </div>

                            <div className="division ">Garde</div>

                            <div className="affectation ">prime de garde</div>

                        </div>
                    </div>

                        <div className="h-task-wrapper"><ul className="fa-ul">

                        </ul></div></div>



                </div>

            </div>
        )
    }
}

Quart.propTypes = propTypes;
Quart.defaultProps = defaultProps;

export default Quart;