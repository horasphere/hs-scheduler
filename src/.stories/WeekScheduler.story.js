import React, {Component} from 'react';
import { storiesOf, action } from '@kadira/storybook';
import 'react-virtualized/styles.css';
import random from 'lodash/random';
import sample from 'lodash/sample';
import keyBy from 'lodash/keyBy'
import debounce from 'lodash/debounce'
import moment from 'moment';

import { WeekScheduler } from './../WeekScheduler'
import { listDates, LOCAL_DATE_FORMAT } from './../utils/date'
import { randomEvent, generateResources, generateEvents } from './helpers'

import './../WeekScheduler/weekscheduler.less'

const NB_RESOURCES = 5000;

class Search extends Component {
    constructor(props) {
      super(props)

      this.state = {
        searchQuery: ''
      }

      this._handleKeyPress = this._handleKeyPress.bind(this);
    }
    _handleKeyPress(e) {
      const F = 70;
      const PREVIOUS_ARROW = 37;
      const NEXT_ARROW = 39;

      if(e.keyCode === F && e.shiftKey) {
        e.preventDefault()
        this._input.select();
      }
      if(e.keyCode === PREVIOUS_ARROW && e.shiftKey) {
        e.preventDefault()
        this.props.previous(this.state.searchQuery);
      }
      if(e.keyCode === NEXT_ARROW && e.shiftKey) {
        e.preventDefault()
        this.props.next(this.state.searchQuery);
      }
      console.log(e.keyCode)
    }
    componentWillMount() {
      document.addEventListener("keydown", this._handleKeyPress);
    }
    componentWillUnmount() {
      document.removeEventListener("keydown", this._handleKeyPress);
    }
    render() {
        const {
          changed,
          next,
          previous,
          count,
          index
          } = this.props;

        return (
            <div>
              <input value={this.state.searchQuery} onChange={(evt) => {
               this.setState({
                  searchQuery: evt.target.value
                })
                changed(evt.target.value || null)
              }}
                ref={(ref) => {
                   this._input = ref;
                }}
                />
              <button onClick={() => {previous(this.state.searchQuery)}}>&lt;</button>
              <button onClick={() => {next(this.state.searchQuery)}}>&gt;</button>
              <span>{(count === 0) ? 0 : index + 1 } / {count}</span>
            </div>
        )
    }
}

class Wrapper extends Component {
  constructor(props) {
    super(props);

    const dates = listDates(new Date(), 7)
    const resources = generateResources(NB_RESOURCES)

    this.state = {
      resourceById: keyBy(resources, 'id'),
      searchQuery: null,
      searchFoundCount: 0,
      searchFocusIndex: 0,
      matches: [],
      scrollToResource: undefined,
      dates,
      resources,
      events: generateEvents(resources, dates)
    }

    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleScrollTo = this.handleScrollTo.bind(this);
    this.handleScrollToRandom = this.handleScrollToRandom.bind(this);
  }
  handleAdd() {
      const resourceId = this.resourceInput.value
      const localDate = this.dateInput.value
      const eventToAdd = randomEvent(resourceId, moment(localDate).toDate());

      this.setState({
        events: [
          ...this.state.events,
          eventToAdd
        ]
      })

      this._weekScheduler.resetMeasurementForResourceId(eventToAdd.resourceId)
  }
  handleRemove() {
    const resourceId = this.resourceInput.value
    const localDate = this.dateInput.value
    const {events} = this.state;

    const filtered = events.filter((event) => {
        return event.resourceId === resourceId && moment(event.start).format(LOCAL_DATE_FORMAT) === localDate;
    })

    const eventToRemove = filtered[filtered.length - 1];
    const index = events.indexOf(eventToRemove)
    if(index > -1) {
      events.splice(index, 1)
      this.setState({
        events: [...events]
      })

      this._weekScheduler.resetMeasurementForResourceId(eventToRemove.resourceId)
    }

  }
  handleScrollTo() {
    const resourceId = this.resourceInput.value

    this.setState({
      scrollToResource: resourceId
    })
  }
  handleScrollToRandom() {
    this.setState({
      scrollToResource: sample(this.state.resources).id
    })
  }
  render() {

      const {dates, resources, events, scrollToResource, searchQuery} = this.state;

      return <div>
          <div>
            <h3>Demo {NB_RESOURCES.toLocaleString('en-US', {minimumFractionDigits: 0})} resources</h3>
            <select defaultValue={resources[0].id} ref={(input) => this.resourceInput = input}>
              {
                resources.map((resource) => {
                  return <option key={resource.id} value={resource.id}>{resource.id}</option>
                })
              }
            </select>
            <select defaultValue={moment(dates[0]).format(LOCAL_DATE_FORMAT)} ref={(input) => this.dateInput = input}>
              {
                dates.map((date) => {
                  const localDate = moment(date).format(LOCAL_DATE_FORMAT)
                  return <option key={localDate} value={localDate}>{localDate}</option>
                })
              }
            </select>
            <button onClick={this.handleAdd}>Add</button>
            <button onClick={this.handleRemove}>Remove</button>
            <button onClick={this.handleScrollTo}>Scroll to</button>
            <button onClick={this.handleScrollToRandom}>Scroll to random</button>
          </div>
          <div>
            <Search
                index={this.state.searchFocusIndex}
                count={this.state.searchFoundCount}
                changed={debounce((searchQuery) => {
                      this.setState({
                        searchQuery,
                        matches: [],
                        searchFoundCount: 0,
                        searchFocusIndex: 0
                      })

                      console.log('Changed', searchQuery)

                }, 300)}
                previous={(searchQuery) => {
                    const {
                      searchFoundCount,
                      searchFocusIndex,
                      matches
                    } = this.state;

                    if(searchFoundCount === 0) {
                      return;
                    }


                    const nextIndex = (searchFocusIndex - 1) % searchFoundCount
                    this.setState({
                      searchFocusIndex: nextIndex,
                      scrollToResource: matches[nextIndex].id
                    })
                }}
                next={(searchQuery) => {
                    const {
                      searchFoundCount,
                      searchFocusIndex,
                      matches
                    } = this.state;

                    if(searchFoundCount === 0) {
                      return;
                    }

                    const nextIndex = (searchFocusIndex + 1) % searchFoundCount
                    this.setState({
                      searchFocusIndex: nextIndex,
                      scrollToResource: matches[nextIndex].id
                    })
                }}
                />
          </div>
          <div>
            <WeekScheduler
              dates={dates}
              resources={resources}
              events={events}
              width={1200}
              height={400}
              scrollToResource={scrollToResource}
              searchQuery={searchQuery}
              searchFinished={({matches, searchQuery}) => {
                  this.setState({
                    searchFoundCount: matches.length,
                    searchFocusIndex: 0,
                    scrollToResource: (matches.length) ? matches[0].id : null,
                    matches
                  })
              }}
              ref={(ref) => {
                  this._weekScheduler = ref
              }}
              />
            </div>
        </div>
    }
}

storiesOf('WeekScheduler', module)
  .add('Basic WeekScheduler with resource column', () => {

    return <Wrapper></Wrapper>
  })
  .add('placeholder', () => {
      return             <div style={{width: 100, height: 55}}>
        <div className="placeholder-quart">
          <div className="animated-background">
            <div className="mask h-separator-1"></div>
            <div className="mask h-separator-2"></div>
            <div className="mask h-separator-3"></div>
            <div className="mask v-separator"></div>
            <div className="mask block-1"></div>
            <div className="mask block-2"></div>
            <div className="mask block-3"></div>
            <div className="mask block-4"></div>
          </div>
        </div>
      </div>
  })