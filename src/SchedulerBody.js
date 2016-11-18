import React, {Component, PropTypes} from 'react';

class SchedulerBody extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="hs-scheduler__body">
                {this.props.children}
            </div>
        )
    }
}

export default SchedulerBody;