import utils from './utils.js'
import {DataError} from './errs.js'

export default class ParentData {
  constructor(parent, data, jsonDB, dataPath) {
    this.parent = parent
    this.__data = data
    this.db = jsonDB
    this.dataPath = dataPath
  }
  /**
    * Check if the array is valid for the wanted use
    * @param deletion
    * @returns {ArrayInfo}
    * @private
    */
  __checkArray(del = false) {
    var arrayInfo = utils.processArray(this.parent)
    if (arrayInfo) {
      if ((!arrayInfo.append || del) && !arrayInfo.isValid(this.data))
        throw new DataError(`DataPath: /${this.dataPath}. Can't find index ${arrayInfo.idx} in array ${arrayInfo.property}`, 10)
    }
    return arrayInfo
  }
  get data() {
    if (this.parent === undefined)
      return this.__data

    var arrayInfo = this.__checkArray()
    if (arrayInfo)
      return arrayInfo.getData(this.__data)
    else
      return this.__data[this.parent]
  }
  set data(data) {
    if (this.parent === undefined) {
      this.db.data = data
      return;
    }
    var arrayInfo = utils.processArray(this.parent)
    if (arrayInfo) {
      if (!this.__data.hasOwnProperty(arrayInfo.property))
        this.__data[arrayInfo.property]
      else if (!Array.isArray(this.data[arrayInfo.property]))
        throw new DataError(`DataPath: /${this.dataPath}. ${arrayInfo.property} is not an Array`, 11)
      arrayInfo.setData(this.__data, data)
    }
  }
  delete() {
    if (this.parent === undefined)
      this.db.data = {}

    var arrayInfo = this.__checkArray(true)
    if (arrayInfo)
      arrayInfo.delete(this.__data)
    else delete this.__data[this.parent]
  }
}