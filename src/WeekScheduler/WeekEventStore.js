import moment from 'moment'

import { localDate } from './../utils/date'

export default class Store {
  constructor(events) {
    this._byId = {}
    this._byResource = {}
    this._byResourceAndDate = {}

    events.forEach((event) => {
      const {
        id,
        resourceId,
        start
        } = event;

      this._byId[id] = event;

      this._byResource[resourceId] = this._byResource[resourceId] || []
      this._byResource[resourceId].push(id);

      const resourceDateKey = `${resourceId}|${localDate(start)}`
      this._byResourceAndDate[resourceDateKey] = this._byResourceAndDate[resourceDateKey] || []
      this._byResourceAndDate[resourceDateKey].push(id)
    })
  }
  selectEventsByResource(resourceId) {
    return (this._byResource[resourceId] || []).map((eventId) => {
      return this._byId[eventId]
    })
  }
  selectEventsByResourceAndDate(resourceId, localDate) {
    const key = `${resourceId}|${localDate}`

    return (this._byResourceAndDate[key] || []).map((eventId) => {
        return this._byId[eventId]
    })
  }
}