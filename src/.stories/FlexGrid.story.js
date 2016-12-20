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
import { Quart } from './Quart'

const resources = generateResources(50);
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
                      const childs =  filtered.map((event) => (
                          <Quart start={event.start} end={event.end} />
                      ))

                      return <FlexCell key={localDate} width={100 / dates.length} style={{backgroundColor: (idx % 2 === 0) ? 'transparent' : 'blue', opacity: (idx % 2 === 0) ? 1 : 0.2}}>
                          <div> {childs }</div>
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
          <div style={{width: 800}}>
            <div class="hs-scheduler__header" style={{boxSizing: 'border-box', display: 'flex', flex: '1 1 auto', flexFlow: 'row nowrap', height: 30}}>
              <div className="flex-cell" style={{boxSizing: 'border-box', flex: '1 1 20%', maxWidth: '20%'}}><div></div></div>
              <div className="flex-cell-date" style={{boxSizing: 'border-box', flex: '1 1 80%', maxWidth: '80%'}}>
                  <div class="" style={{boxSizing: 'border-box', display: 'flex', flex: '1 1 auto', flexFlow: 'row nowrap'}}>
                      <div class="hs-scheduler--week__header__date" style={{boxSizing: 'border-box', flex: '1 1 14.2857%', maxWidth: '14.2857%'}}>FRI 16 DEC</div>
                      <div class="hs-scheduler--week__header__date" style={{boxSizing: 'border-box', flex: '1 1 14.2857%', maxWidth: '14.2857%'}}>SAT 17 DEC</div>
                    <div class="hs-scheduler--week__header__date" style={{boxSizing: 'border-box', flex: '1 1 14.2857%', maxWidth: '14.2857%'}}>SUN 18 DEC</div>
                    <div class="hs-scheduler--week__header__date" style={{boxSizing: 'border-box', flex: '1 1 14.2857%', maxWidth: '14.2857%'}}>MON 19 DEC</div>
                    <div class="hs-scheduler--week__header__date" style={{boxSizing: 'border-box', flex: '1 1 14.2857%', maxWidth: '14.2857%'}}>TUE 20 DEC</div>
                    <div class="hs-scheduler--week__header__date" style={{boxSizing: 'border-box', flex: '1 1 14.2857%', maxWidth: '14.2857%'}}>WED 21 DEC</div>
                    <div class="hs-scheduler--week__header__date" style={{boxSizing: 'border-box', flex: '1 1 14.2857%', maxWidth: '14.2857%'}}>THU 22 DEC</div>
                  </div>
              </div>
          </div>
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
          </div>
        )
      }
    }

    return <VirtualList />
  })