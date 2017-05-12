var required;
try {
  required = require('./lib')
} catch (e) {
  required = require('./_')
}
let {utils, ParentData, DatabaseError, DataError} = required;


/**
  * @class {DBDotJSON}
  * @author Zane Hannan AU
  * @copyright GPL-3.0
  * @implements {dataPath}
  *
  * @implements {push}
  * @implements {delete}
  *
  * @implements {save}
  * @implements {load}
  * @implements {reload}
  */
export default class DBDotJSON {
/** Create the JSON database
  * @param {String} file - where to save the data base or file name. Required.
  * @param {Object} opts
    * @param {String} filename - overrides file.
    * @param {Boolean} saveOnPush - saving on adding to the data.
    * @param {Boolean} saveOnDel - saving on deleting any data.
    * @param {*} init - the initial state of the database.
    * @param {Boolean} overwrite - whether to overwrite data (by default) when pushing.
    * @param {Function|Array} replacer - JSON.stringify replacer.
    * @param {Number|String} humanReadable - JSON.stringify spaces.
    * @see [JSON.stringify options]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify}
    * @param {Function} reviver - reviver for JSON.parse data.
    * @see [JSON.parse options]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse}
    * @param {Function} exists - returns true if the file exists.
    * @param {Function} mkdir - what is used to create the folders.
    * @param {Function|String} dirname - resolver or directory to write filename.
    * @param {Function} read - should be synchronous or return a Promise resolving to parsable JSON.
    * @param {Function} save - should be synchronous or return a Promise.
  * @constructor
  */
  constructor(filename = 'db.json', opts = {}) {
    if (Array.isArray(filename))
      filename = filename.join('/')

    if (!filename)
      throw new SyntaxError('File (argument 0) must exist and be a string.')

    const {
      file = filename, saveOnPush = true, saveOnDel = saveOnPush,
      init = {}, overwrite = true,
      replacer = undefined, humanReadable = 0, reviver = undefined,
      exists = (file) => require('fs').existsSync(file),
      mkdir = (folder) => require('mkdirp').sync(folder),
      dirname = (dir) => require('path').dirname(dir),
      read = (name = file) => require('fs').readFileSync(name, 'utf8'),
      save = (data,name=file) => require('fs').writeFileSync(name,data,'utf8')
    } = opts

    this.file = file
    this.filename = file.endsWith('.json') ? file : (file+'.json')

    this.loaded = false
    this.state = init

    Promise.resolve(exists(filename)).then(e => {
      if (!e) {
        let dir = typeof dirname === 'string' ? dirname : dirname(this.filename)
        mkdir(dir)
        this.save(true)
        this.loaded = true
      }
    })

    this.opts = {
      filename, saveOnPush, saveOnDel, exists, mkdir,
      dirname, read, save, init, overwrite, json: {
        replacer, humanReadable, reviver
      }
    }

    this.saveOnPush = this.opts.saveOnPush
    this.saveOnDel = this.opts.saveOnDel
    this.overwrite = this.opts.overwrite
  }

  /**
    * @param {String} dataPath - path leading to the data
    * @returns {Array}
    * @private
    */
  __processDataPath(dataPath) {
    if (dataPath === undefined || !dataPath.trim())
      throw new DataError("The DataPath can't be empty.", 6)

    if (dataPath === '/')
      return []
    else
      return utils.removeEdgeSlashes(dataPath).split('/')
  }

  /**
    * @private
    */
  __getParentData(dataPath, create) {
    var path = this.__processDataPath(dataPath)
    var last = path.pop()
    return new ParentData(last, this.__getData(path, create), this, dataPath)
  }

  /**
    * Get the deta stored in the data base
    * @param {String} dataPath - path leading to the data
    * @returns {Promise}
    * - Resolves to the requested data
        @returns {*}
    * - Rejects with errors.
        @throws {DatabaseError|DataError}
    */
  getData(dataPath) {
    let path = this.__processDataPath(dataPath)
    return this.__getData(path)
  }

  /**
    * @param {Array} dataPath - path leading to the data
    * @param {Boolean} create - whether to create data or not.
    * @private
    */
  __getData(dataPath, create = false) {
    return this.load().then(() => {
      if (dataPath.length === 0)
        return this.state

      const recursiveProcessDataPath = (data, idx) => {
        var prop = dataPath[idx]
        /**
          * Find or create the wanted data.
          */
        const findData = (isArray = false) => {
          if (data.hasOwnProperty(prop))
            data = data[prop]
          else if (create) {
            if (isArray)
              data[prop] = [];
            else
              data[prop] = {};

            data = data[prop];
          } else
            throw new DataError(`Can't find dataPath: /${dataPath.join("/")}. Stopped at ${prop}.`, 5)
        }

        var arrayInfo = utils.processArray(prop)
        if (arrayInfo) {
          prop = arrayInfo.property
          findData(true)
          if (!Array.isArray(data))
            throw new DataError(`DataPath: /${dataPath.join("/")}. ${property} is not an Array.`, 11)

          var arrayIndex = arrayInfo.getIndex(data, true)
          if (data.hasOwnProperty(arrayIndex)) {
            data = data[arrayIndex]
          } else if (create) {
            if (arrayInfo.append) {
              data.push({})
              data = data[data.length - 1]
            } else {
              data[arrayIndex] = {}
              data = data[arrayIndex]
            }
          } else
            throw new DataError(`DataPath: /${dataPath.join("/")}. Can't find index ${arrayInfo.index} in Array ${prop}.`, 10);
        } else {
          findData()
        }

        if (dataPath.length === ++idx)
          return data

        return recursiveProcessDataPath(data, index)
      }

      return recursiveProcessDataPath(this.state, 0)
    })
  }

  /**
    * Pushing data into the database
    * @param {String} dataPath - path leading to the data
    * @param {*} data - data to push
    * @param {Boolean} overwrite - overriding or not the data, if not, it will merge them
    * @param {Boolean} save - whether to save or not after pushing.
    * @returns {DBDotJSON}
    */
  push(dataPath, data, overwrite = this.overwrite, save = this.saveOnPush) {
    dataPath = utils.removeEdgeSlashes(dataPath)

    return this.__getParentData(dataPath, true).then(dbData => {
      if (!dbData)
        throw new Error("Data not found.")

      var toSet = data
      if (!overwrite) {
        if (Array.isArray(data)) {
          var storedData = dbData.getData()
          if (storedData === undefined)
            storedData = []
          else if (!Array.isArray(storedData))
            throw new DataError("Can't merge another type of data with an Array.", 3)
          toSet = storedData.concat(data)
        } else if (data === Object(data)) {
          if (Array.isArray(dbData.getData()))
            throw new DataError("Can't merge an Array with an Object.", 4)

          toSet = utils.merge(dbData.getData(), data)
        }
      }
      dbData.setData(toSet)

      if (save)
        this.save()

      return resolve(this)
    });
  }

  /**
    * Delete data
    * @param dataPath - path leading to the data
    * @param save - whether to save or not after deleting data
    * @returns {DBDotJSON}
    */
  delete(dataPath, save = this.saveOnDel) {
    dataPath = utils.removeEdgeSlashes(dataPath)
    var dbData = this.__getParentData(dataPath, true)
    if (!dbData)
      return this

    dbData.delete()

    if (save)
      this.save()

    return this
  }

  /**
    * Reload the database from the file
    * @returns {Promise}
    * - Will resolve to {DBDotJSON} if loaded or reloaded.
    * - Will reject if an error occurs.
    */
  reload() {
    this.loaded = false
    return this.load(true)
  }

  /**
    * Manually load the database
    * It is automatically called when the first getData is done
    * @returns {Promise}
    * - Will resolve to {DBDotJSON} if loaded or reloaded.
    * - Will reject if an error occurs.
    */
  load(force = false) {
    if (this.loaded && !force)
      return Promise.resolve(this)

    this.loaded = false
    return Promise.resolve(this.opts.read(this.filename)).then(data => {
      this.state = JSON.parse(data, this.opts.json.reviver)
      this.loaded = true
      return this
    }).catch(error => {
      var err = new DatabaseError("Couldn't load the Database.", 1, error)
      err.inner = error
      this.loaded = false
      throw err
    })
  }

  /**
    * Manually save the database
    * By default you can't save the database if it's not loaded
    * @param force force the save of the database
    * @returns {Promise}
    * - Will resolve to {DBDotJSON} if saved without errors.
    * - Will reject if an error occurs.
    */
  save(force = false) {
    if (!force && !this.loaded)
      return Promise.reject(new DatabaseError("DataBase not loaded. Can't write.", 7))

    return Promise.resolve(this.opts.save(JSON.stringify(
      this.state, this.opts.json.replacer, this.opts.json.humanReadable
    ))).then(() => {
      return this
    }).catch(error => {
      var err = new DatabaseError("Couldn't save the Database.", 2, error)
      err.inner = error
      throw err
    })
  }
}
