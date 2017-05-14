import utils from './utils.js'
import {DataError} from './errs.js'

export default class ParentData {
  constructor(parent, data, jsonDB, dataPath) {
    console.log('%s: %j', 'ParentData', {parent, data, dataPath});
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
    console.log('%s: %j', 'ParentData/__checkArray', {parent, data, dataPath});
    var arrayInfo = utils.processArray(this.parent)
    if (arrayInfo) {
      if ((!arrayInfo.append || del) && !arrayInfo.isValid(this.data))
        throw new DataError(`DataPath: /${this.dataPath}. Can't find index ${arrayInfo.idx} in array ${arrayInfo.property}`, 10)
    }
    return arrayInfo
  }
  getData() {
    console.log('%s: %j', 'ParentData/getData', {});
    if (this.parent === undefined)
      return this.__data

    var arrayInfo = this.__checkArray()
    if (arrayInfo)
      return arrayInfo.getData(this.__data)
    else
      return this.__data[this.parent]
  }
  setData(data) {
    if (this.parent === undefined) {
      this.db.state = this.db.opts.init
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
      this.db.state = {}

    var arrayInfo = this.__checkArray(true)
    if (arrayInfo)
      arrayInfo.delete(this.__data)
    else delete this.__data[this.parent]
  }
}
