import { PropTypes } from 'react'
import elementType from 'react-prop-types/lib/elementType'

const {
    instanceOf,
    arrayOf,
    oneOfType,
    shape,
    string,
    number
} = PropTypes

export const assignmentShape = shape({
  id: oneOfType([string, number]).isRequired,
  start: instanceOf(Date).isRequired,
  end: instanceOf(Date).isRequired
})

export const resourceShape = shape({
  id: oneOfType([string, number]).isRequired,
  name: string.isRequired,
  assignments: arrayOf(assignmentShape).isRequired
})

export const weekComponentsShape = shape({
  headerTitle: elementType.isRequired,
  headerWeekday: elementType.isRequired,
  assignment: elementType.isRequired,
  resource: elementType.isRequired
})
