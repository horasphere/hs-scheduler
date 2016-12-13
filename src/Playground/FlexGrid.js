
import React, {Component, PropTypes} from 'react';


class Row extends Component {
    render() {
        const style = {
            boxSizing: 'border-box',
            display: 'flex',
            flex: '0 1 auto',
            flexDirection: 'row',
            flexWrap: 'wrap'
        }

        return (
            <div style={style}>
                {this.props.children}
            </div>
        )
    }
}

class Column extends Component {
    render() {
        const { width, bgColor } = this.props;

        const style = {
            position: 'relative',
            boxSizing: 'border-box',
            flex: `1 1 ${width}`,
            backgroundColor: bgColor || 'white'
        }

        return (
            <div style={style}>
                {this.props.children}
            </div>
        )
    }
}

class Block extends Component {
    render() {
        const { height, bgColor, width } = this.props;

        const style = {
            height,
            backgroundColor: bgColor,
            margin: 5,
            width: width || 'auto'
        }

        return (
            <div style={style}>
                {this.props.children}
            </div>
        )
    }
}

class FlexGrid extends Component {
    render() {
        return (
            <div style={{width: 500}}>
                <Row>
                    <Column width="20%" bgColor="grey"/>
                    <Column width="80%" bgColor="pink">
                        <Row>
                            <Column width="50%" bgColor="pink">
                                <Block height={20} bgColor="red">B1</Block>
                                <Block height={60} bgColor="red">B2</Block>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 4,
                                    width: 5,
                                    height: 5,
                                    backgroundColor: 'black'
                                }}>
                                </div>
                            </Column>
                            <Column width="50%" bgColor="orange">
                                <Block height={30} bgColor="blue">B3</Block>
                            </Column>
                        </Row>
                        <Row>
                            <Column width="100%" bgColor="green">
                                <Block height={3} bgColor="red" width={50}>B4</Block>
                            </Column>
                        </Row>
                    </Column>
                </Row>
            </div>
        )
    }
}

export default FlexGrid;


