import React, {Component} from 'react';
import { storiesOf, action } from '@kadira/storybook';
import 'react-virtualized/styles.css';
import moment from 'moment';
import { Grid, CellMeasurer } from 'react-virtualized'
import shallowCompare from 'react-addons-shallow-compare'


import { FlexRow, FlexCell } from './../Flex'
import { FlexGrid, ScheduleRow } from './../Playground'
import { listDates, LOCAL_DATE_FORMAT } from './../utils/date'
import { randomEvent, generateResources, generateEvents } from './helpers'
import { Quart } from './../Quart'

const resources = generateResources(350);
const dates = listDates(new Date(), 7);
const events = generateEvents(resources, dates);

storiesOf('Flex grid', module)
    .add('with timeline', () => (
        <FlexGrid />
    ))
  .add('scheduler grid', () => (
      <div style={{width: 1000, height: 400, overflowY: 'auto'}}>
        {
          resources.map((resource, index) => (
            <FlexRow key={resource.id} style={{backgroundColor: (index % 2 === 0) ? 'transparent' : '#DDD'}}>
              <FlexCell width={20} style={{backgroundColor: 'red', opacity: 0.2}}>
                {resource.id}
              </FlexCell>
              <FlexCell width={80}>
                <FlexRow>
                  {
                    dates.map((date, idx) => {
                      const localDate = moment(date).format(LOCAL_DATE_FORMAT)
                      const filtered = events.filter((event) => {
                          return event.resourceId === resource.id && moment(event.start).format(LOCAL_DATE_FORMAT) === localDate
                      })
                      return <FlexCell key={localDate} width={100 / dates.length} style={{backgroundColor: (idx % 2 === 0) ? 'transparent' : 'blue', opacity: (idx % 2 === 0) ? 1 : 0.2}}>
                        {
                          filtered.map((event) => (
                            <Quart start={event.start} end={event.end} />
                          ))
                        }
                      </FlexCell>
                    })

                  }
                </FlexRow>
              </FlexCell>
            </FlexRow>
          ))
        }
      </div>
  ))
  .add('Virtual list', () => {
    const rowRenderer = ({ index, isScrolling, key, style }) => {
      //if(isScrolling) {
      //  return <div key={key} stye={style}>...</div>
      //}

      return <div key={key} style={style} >
          <ScheduleRow index={index} resource={resources[index]} events={events} dates={dates} />
        </div>
    }
    class VirtualList extends Component {
      constructor (props) {
        super(props)

        this._cellRenderer = this._cellRenderer.bind(this)
      }
      _cellRenderer ({ rowIndex, style, ...rest }) {
        // CellMeasurer context style is undefined
        style = style || {}
        // By default, List cells should be 100% width.
        // This prevents them from flowing under a scrollbar (if present).
        style.width = '100%'

        return rowRenderer({
          index: rowIndex,
          style,
          ...rest
        })
      }
      shouldComponentUpdate (nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
      }
      render () {
        return (
          <CellMeasurer
            cellRenderer={this._cellRenderer}
            columnCount={1}
            rowCount={resources.length}
            width={800}
            >
            {({ getRowHeight }) => (
              <Grid
                autoContainerWidth
                cellRenderer={this._cellRenderer}
                columnWidth={800}
                columnCount={1}
                overscanColumnCount={0}
                overscanRowCount={10}
                height={300}
                width={800}
                rowHeight={getRowHeight}
                rowCount={resources.length}
                />
            )}
          </CellMeasurer>
        )
      }
    }

    return <VirtualList />
  })