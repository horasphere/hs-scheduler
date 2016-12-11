import React, {Component} from 'react';
import { defaultCellRangeRenderer, Grid } from 'react-virtualized'
import Chance from 'chance';

const chance = new Chance();

function getItems(size) {
    var items = [];
    for(var i = 0; i < size; i++) {
        items.push([chance.name(), chance.gender(), chance.email(), chance.address()])
    }
    return items;
}

// Grid data as an array of arrays
const list =
    getItems(1000)
    // And so on...

const sleep = (millis) => {
    const end = new Date().getTime() + millis;
    while(new Date().getTime() < end) {

    }
}

function cellRenderer ({ columnIndex, key, rowIndex, style, isScrolling }) {
    if(isScrolling)
        return <div
            key={key}
            style={style}
            >...</div>
    else {
        sleep(5)
        return (
            <div
                key={key}
                style={style}
                >
                {list[rowIndex][columnIndex]}
            </div>
        )
    }
}

function cellRangeRenderer ({
    cellCache,
    cellRenderer,
    columnSizeAndPositionManager,
    columnStartIndex,
    columnStopIndex,
    horizontalOffsetAdjustment,
    isScrolling,
    rowSizeAndPositionManager,
    rowStartIndex,
    rowStopIndex,
    scrollLeft,
    scrollTop,
    verticalOffsetAdjustment,
    visibleColumnIndices,
    visibleRowIndices
    }) {
    const renderedCells = []

    for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
        let rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex)

        for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
            let columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex)
            let isVisible = (
                columnIndex >= visibleColumnIndices.start &&
                columnIndex <= visibleColumnIndices.stop &&
                rowIndex >= visibleRowIndices.start &&
                rowIndex <= visibleRowIndices.stop
            )
            let key = `${rowIndex}-${columnIndex}`
            let style = {
                height: rowDatum.size,
                left: columnDatum.offset + horizontalOffsetAdjustment,
                position: 'absolute',
                top: rowDatum.offset + verticalOffsetAdjustment,
                width: columnDatum.size
            }

            let cellRendererParams = {
                columnIndex,
                isScrolling,
                isVisible,
                key,
                rowIndex,
                style
            }

            let renderedCell

            // Avoid re-creating cells while scrolling.
            // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
            // If a scroll is in progress- cache and reuse cells.
            // This cache will be thrown away once scrolling completes.
            // However if we are scaling scroll positions and sizes, we should also avoid caching.
            // This is because the offset changes slightly as scroll position changes and caching leads to stale values.
            // For more info refer to issue #395
            if (
                isScrolling &&
                !horizontalOffsetAdjustment &&
                !verticalOffsetAdjustment
            ) {
                if (!cellCache[key]) {
                    cellCache[key] = cellRenderer(cellRendererParams)
                }
                renderedCell = cellCache[key]
                // If the user is no longer scrolling, don't cache cells.
                // This makes dynamic cell content difficult for users and would also lead to a heavier memory footprint.
            } else {
                renderedCell = cellRenderer(cellRendererParams)
            }

            if (renderedCell == null || renderedCell === false) {
                continue
            }

            renderedCells.push(renderedCell)
        }

        var timelineHeight = 2;

        var timelineStyle = {
            position: 'absolute',
            top: rowDatum.offset + rowDatum.size + verticalOffsetAdjustment - timelineHeight,
            left: 0,
            width: '100%',
            backgroundColor: 'red',
            height: timelineHeight
        }

        renderedCells.push(<div style={timelineStyle} className="timeline-row"></div>);

        console.log('rowDatum', rowDatum, verticalOffsetAdjustment)
    }

    return renderedCells
}

//function cellRangeRenderer (props) {
//    console.log('cellRangeRenderer', props)
//    var positionManager = props.rowSizeAndPositionManager;
//
//    var stats = {
//        cellCount:positionManager.getCellCount(),
//        cellSIze:positionManager.getEstimatedCellSize(),
//        lastMeasuredIndex:positionManager.getLastMeasuredIndex(),
//    }
//
//    const children = defaultCellRangeRenderer(props)
//    children.push(
//        <div style={{
//            backgroundColor: 'red'
//
//        }}>My custom overlay</div>
//    )
//    return children
//}

function CustomizedGrid (props) {
    return (
            <Grid
                cellRenderer={cellRenderer}
                cellRangeRenderer={cellRangeRenderer}
                columnCount={list[0].length}
                columnWidth={150}
                height={300}
                rowCount={list.length}
                rowHeight={30}
                width={800}
                />
    )
}

module.exports = CustomizedGrid
