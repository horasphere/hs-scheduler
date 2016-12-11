import React, {Component} from 'react';
import { defaultCellRangeRenderer, List, Grid, CellMeasurer } from 'react-virtualized'
import Chance from 'chance';

const chance = new Chance();

const generateAdresses = function(maxSize) {
    const size = Math.floor(Math.random() * maxSize);
    const adresses = [];

    for(var i=0; i < size; i++) {
        adresses.push(chance.address())
    }

    return adresses;
}

function getItems(size) {
    var items = [];
    for(var i = 0; i < size; i++) {
        var item = {
            name: chance.name(),
            gender: chance.gender(),
            email: chance.email(),
            adresses: generateAdresses(4),
        }

        items.push(item)
    }

    return items;
}

// Grid data as an array of arrays
const list = getItems(1000)

const sleep = (millis) => {
    const end = new Date().getTime() + millis;

    while(new Date().getTime() < end) {}
}

class Row extends Component {
    render() {
        const {key, style, index} = this.props;

        const item = list[index];

        const rowStyle = {
            ...style,
            borderBottom: '1px solid #DDD',
            width: '100%',
            display: 'table'
        }

        const blockStyle = {
            display: 'table-cell',
            width: '25%'
        }


        return <div key={key} style={rowStyle}>
            <div style={blockStyle}>{item.name}</div>
            <div style={blockStyle}>{item.gender}</div>
            <div style={blockStyle}>{item.email}</div>
            <div style={blockStyle}>
                <ul>
                    {item.adresses.map((address, index) => {
                        return <li key={index}>{address}</li>
                    })}
                </ul>
            </div>
        </div>
    }
}

const rowRenderer = ({ index, isScrolling, key, style }) => {
    return <Row key={key} style={style} index={index}></Row>
}

class VirtualListPoc extends Component {
    constructor(props) {
        super(props);

        this._cellRenderer = this._cellRenderer.bind(this)
    }
    _cellRenderer ({ rowIndex, style, ...rest }) {

        console.log('_cellRenderer')

        // CellMeasurer context style is undefined
        style = style || {};
        // By default, List cells should be 100% width.
        // This prevents them from flowing under a scrollbar (if present).
        style.width = '100%'

        return rowRenderer({
            index: rowIndex,
            style,
            ...rest
        })
    }
    render() {
        return (
                <CellMeasurer
                    cellRenderer={this._cellRenderer}
                    columnCount={1}
                    rowCount={list.length}
                    width={800}
                    >
                    {({ getRowHeight }) => (
                        <Grid
                            autoContainerWidth
                            cellRenderer={this._cellRenderer}
                            columnWidth={800}
                            columnCount={1}
                            overscanColumnCount={0}
                            overscanRowCount={0}
                            height={300}
                            width={800}
                            rowHeight={getRowHeight}
                            rowCount={list.length}
                            />
                    )}
                </CellMeasurer>
        )
    }
}


module.exports = VirtualListPoc
