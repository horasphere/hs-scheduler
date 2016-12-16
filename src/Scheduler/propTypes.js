import {PropTypes} from 'react'

const {
    instanceOf,
    oneOfType,
    shape,
    string,
    number
} = PropTypes

export const eventShape = shape({
  id: PropTypes.string.isRequired,
  resourceId: PropTypes.string.isRequired,
  start: instanceOf(Date).isRequired,
  end: instanceOf(Date).isRequired
})

export const resourceShape = shape({
  id: oneOfType([string, number]).isRequired,
  title: string.isRequired
})
