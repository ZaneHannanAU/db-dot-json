import {DataError} from './errs.js'

const isInt = v => !isNaN(v) && parseInt(Number(v)) == v && !isNaN(parseInt(v, 10))

export default class ArrayInfo {
  constructor(property, idx) {
    this.property = property
    this.idx = idx
    this.append = idx === ''
    if (isInt(idx))
      this.idx = parseInt(idx)
    else if (!this.append)
      throw new DataError('Only numerical values are accepted for array index.', 200)
  }

  /**
    * Get the index for the array
    * @param data
    * @param avoidProperty
    * @returns {*}
    */
  getIndex(data, avoidProperty = false) {
    let idx = this.idx
    if (idx == -1) {
      var dataInterable = avoidProperty ? data : data[this.property]

      if (dataInterable.length === 0)
        return 0
      return dataInterable.length - 1
    }
    return idx
  }

  /**
    * Get the Data
    * @param data
    * @returns {*}
    * @constructor
    */
  getData(data) {
    if (this.append)
      throw new DataError("Can't get data when appending.", 100)

    let idx = this.getIndex(data)
    return data[this.property][idx]
  }

  /**
    * Set the data for the array
    * @param data
    * @param value
    */
  setData(data, val) {
    if (this.append)
      data[this.property].push(val)
    else {
      let idx = this.getIndex(data)
      data[this.property][idx] = val
    }
  }

  /**
    * Check if the ArrayInfo is valid for the given data
    * @param data
    * @returns {boolean}
    * @constructor
    */
  isValid(data) {
    var idx = this.getIndex(data)
    return data[this.property].hasOwnProperty(idx)
  }

  /**
    * Delete the index from the array
    * @param data
    */
  delete(data) {
    var idx = this.getIndex(data)
    data[this.property].splice(idx, 1)
  }
}
