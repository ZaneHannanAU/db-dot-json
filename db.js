/** @func deepMerge
  * @arg {*} srcs - The objects to merge
  */
let deepMerge = (...srcs) => srcs.reduce((dest, src) => {
  for (var prop in src) {
    if (prop in dest && dest[prop] === undefined)
      dest[prop] = src[prop];
    else if (prop in dest && Array.isArray(dest[prop]))
      // concat Arrays
      dest[prop] = dest[prop].concat(src[prop])
    else if (prop in dest && typeof dest[prop] === 'object')
      // merge Objects, wheeee
      dest[prop] = deepMerge(dest[prop], src[prop])
    else
      // set new vals
      dest[prop] = src[prop]
  }
  return dest
}, {})


class DatabaseError extends Error {
  constructor(msg, id, nested) {
    super(msg, id, nested)
    this.name = 'DatabaseError'
    this.inner = nested
    this.id = id
  }
  toString() {
    return `${this.name}: ${this.message}${this.inner ? ':\n'+this.inner : ''}`
  }
}

/**
  * @class {DBDotJSON}
  * @author Zane Hannan AU
  * @copyright GPL-3.0
  *
  * @implements {save}
  * @implements {load}
  * @implements {reload}
  */
export default class DBDotJSON {
/** Create the JSON database
  * @arg {object} opts
    * @arg {string|array} file - where to save the data base or file name. Required.
    * @arg {string} filename - overrides file.
    * @arg {*} init - the initial state of the database.
    * @arg {function|array} replacer - JSON.stringify replacer.
    * @arg {number|string} humanReadable - JSON.stringify spaces.
    * @see [JSON.stringify options]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify}
    * @arg {function} reviver - reviver for JSON.parse data.
    * @see [JSON.parse options]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse}
    * @arg {function} exists - returns true if the file exists.
    * @arg {function} mkdir - what is used to create the folders.
    * @arg {function|string} dirname - resolver or directory to write filename.
    * @arg {function} read - should be synchronous or return a Promise resolving to parsable JSON.
    * @arg {function} save - should be synchronous or return a Promise.
    * @arg {funcion} setup - Synchronous function
    * @arg {function} pjoin - Joins an array of folder names.
  */
  constructor({
    file = 'db.json', filename = file, init = {type: 'DBDotJSON'},
    replacer = null, humanReadable = 0, reviver = null,
    exists = (file) => require('fs').existsSync(file),
    mkdir = (folder) => require('mkdirp').sync(folder),
    dirname = (dir) => require('path').dirname(dir),
    read = (name = file) => require('fs').readFileSync(name, 'utf8'),
    save = (data,name=file) => require('fs').writeFileSync(name,data,'utf8'),
    setup = () => {
      try { this.loadSync() } catch(e) { this.saveSync(true) }
    },
    pjoin = require('path').join
  }) {
    this.loaded = false
    this.state = init

    if (Array.isArray(file) && file === filename)
      file = filename = pjoin(...file)
    else if (Array.isArray(file))
      file = pjoin(...file)

    if (Array.isArray(filename))
      filename = pjoin(...filename)

    if (!file)
      throw new SyntaxError('`file` must exist and be a string.')

    this.opts = {
      filename, exists, mkdir,
      dirname, read, save, init, json: {
        replacer, humanReadable, reviver
      }
    }
    this.file = file
    this.filename = filename.endsWith('.json') ? filename : (filename+'.json')
    this.utils = {deepMerge}
    if (typeof setup === 'function') setup()
  }

  /** @method toJSON
    * @returns this.state
    */
  toJSON() {
    return this.state
  }

  /**
    * Reload the database from the file
    * @returns {DBDotJSON as Promise}
    * @throws DatabaseError
    */
  reload() {
    this.loaded = false
    return this.load(true)
  }
  /**
    * Reload the database from the file synchronously
    * @returns {DBDotJSON as this}
    * @throws DatabaseError
    */
  reloadSync() {
    this.loaded = false
    return this.loadSync(true)
  }

  /**
    * Manually load the database
    * @returns {DBDotJSON as Promise}
    * @throws DatabaseError
    */
  load(force = false) {
    if (this.loaded && !force)
      return Promise.resolve(this)

    this.loaded = false

    return Promise.resolve(this.opts.exists(this.filename)).then(e => {
      if (!e) {
        this.dirname = typeof this.opts.dirname === 'string' ? this.opts.dirname : this.opts.dirname(filename)
        this.opts.mkdir(this.dirname)
        this.save(true)
        this.loaded = true
      }

      return Promise.resolve(this.opts.read(this.filename))
      .then(data => {
        this.state = JSON.parse(data, this.opts.json.reviver)
        this.loaded = true
        return this
      }).catch(err => {
        this.loaded = false
        throw new DatabaseError("Couldn't load the Database.", 1, err)
      })
    })

  }
  /**
    * Manually load the database
    * @returns {DBDotJSON as this}
    * @throws DatabaseError
    */
  loadSync(force = false) {
    if (this.loaded && !force)
      return this

    this.loaded = false
    try {
      if (!this.opts.exists(this.filename)) {
        this.dirname = typeof this.opts.dirname === 'string' ? (
          this.opts.dirname
        ) : this.opts.dirname(this.filename)
        this.opts.mkdir(this.dirname)
        this.save(true)
        this.loaded = true
      }
      var data = this.opts.read(this.filename)
      this.state = JSON.parse(data, this.opts.json.reviver)
      this.loaded = true
      return this
    } catch (err) {
      this.loaded = false
      throw new DatabaseError("Couldn't load the Database.", 1, err)
    }
  }

  /**
    * Manually save the database
    * By default you can't save the database if it's not loaded
    * @arg {boolean} force force the save of the database
    * @returns {DBDotJSON as Promise}
    * @throws DatabaseError
    */
  save(force = false) {
    if (!force && !this.loaded)
      return Promise.reject(
        new DatabaseError("DataBase not loaded. Can't write.", 7)
      )

    return Promise.resolve(
      this.opts.save(
        JSON.stringify(
          this.state, this.opts.json.replacer, this.opts.json.humanReadable
        ), this.filename
      )
    )
    .then(() => this).catch(err => {
      throw new DatabaseError("Couldn't save the Database.", 2, err)
    })
  }

  /**
    * Manually save the database synchronously
    * By default you can't save the database if it's not loaded
    * @arg force force the save of the database
    * @returns {DBDotJSON as this}
    * @throws DatabaseError
    */
  saveSync(force = false) {
    if (!force && !this.loaded)
      throw new DatabaseError("DataBase not loaded. Can't write.", 7)

    try {
      var data = JSON.stringify(
        this.state, this.opts.json.replacer, this.opts.json.humanReadable
      )
      this.opts.save(data, this, filename)
      return this
    } catch (err) {
      throw new DatabaseError("Couldn't save the Database.", 2, err)
    }
  }


  /** @method load - Loads a new database.
    * @arg {object} opts - options as shown above
    * @returns {DBDotJSON as Promise}
    */
  static load(opts) {
    return new DBDotJSON(opts).load()
  }

  /** @method loadSync - Loads a new database.
    * @arg {object} opts - options as shown above
    * @returns {DBDotJSON as this}
    */
  static loadSync(opts = {}) {
    return new DBDotJSON(opts).loadSync()
  }
}
