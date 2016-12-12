import {PropTypes} from 'react'

const {
    instanceOf,
    oneOfType,
    shape,
    string,
    number
} = PropTypes

export const eventShape = shape({
  id: oneOfType([string, number]).isRequired,
  start: instanceOf(Date).isRequired,
  end: instanceOf(Date).isRequired
})

export const resourceShape = shape({
  id: oneOfType([string, number]).isRequired
})
