/**
 * Default CellMeasurer `cellSizeCache` implementation.
 * Permanently caches all cell sizes (identified by column and row index) unless explicitly cleared.
 * Can be configured to handle uniform cell widths and/or heights as a way of optimizing certain use cases.
 */
export default class KeyBasedCellSizeCache {
  constructor ({
      buildColumnKey = (index) => (0),
      buildRowKey = (index) => (0)
    } = {}) {
    this._buildColumnKey = buildColumnKey;
    this._buildRowKey = buildRowKey;

    this._keyByRowIndex = {}
    this._keyByColumnIndex = {}

    this._heightByRowKey = {}
    this._widthByColKey = {}
  }

  clearAllColumnWidths () {
    this._keyByRowIndex = {}
  }

  clearAllRowHeights () {
    this._keyByRowIndex = {}
  }

  clearColumnWidth (index) {
    delete this._keyByColumnIndex[index]
  }

  clearRowHeight (index) {
    delete this._keyByRowIndex[index]
  }

  getColumnWidth (index) {
    return this._widthByColKey[this.getColumnKey(index)]
  }

  getRowHeight (index) {
    return this._heightByRowKey[this.getRowKey(index)]
  }

  setColumnWidth (index, width) {
    this._widthByColKey[this.getColumnKey(index)] = width
  }

  setRowHeight (index, height) {
    this._heightByRowKey[this.getRowKey(index)] = height
  }

  getRowKey(index) {
    if(!this._keyByRowIndex[index]) {
      this._keyByRowIndex[index] = this._buildRowKey(index)
    }

    return this._keyByRowIndex[index]
  }

  getColumnKey(index) {
    if(!this._keyByColumnIndex[index]) {
      this._keyByColumnIndex[index] = this._buildColumnKey(index)
    }

    return this._keyByColumnIndex[index]
  }
}
