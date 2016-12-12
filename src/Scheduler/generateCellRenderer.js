
export default function ({ resources, resourceById, eventById, rowRenderer }) {
  return function cellRenderer ({ rowIndex, style, ...rest }) {
    console.log('cell-renderer')
        // CellMeasurer context style is undefined
    style = style || {}

        // By default, List cells should be 100% width.
        // This prevents them from flowing under a scrollbar (if present).
    style.width = '100%'

    return rowRenderer({
      index: rowIndex,
      style,
      resource: resources[rowIndex],
      resourceById,
      eventById,
      ...rest
    })
  }
}
