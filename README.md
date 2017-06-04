---
title: DBDotJSON
package: db-dot-json
url: https://github.com/ZaneHannanAU/db-dot-json
bugs: https://github.com/ZaneHannanAU/db-dot-json/issues
homepage: https://github.com/ZaneHannanAU/db-dot-json#readme
installation: `npm i --save db-dot-json`
---

# db-dot-json

Initially a recreation of [@Belphemur&nbsp;/&nbsp;node-json-db][Original] with more options and Bower/requireJS compatibility.

Now a simple base for a db.JSON database.

# Promises

Many of the functions used in this return a `Promise`.

This is to allow the level of customisability that is offered (See [options][Options]) as well as chaining and multi-writing via `Promise.all` and/or `Promise.resolve(...).then(val => {})` chains.

If you would like a simpler, synchronous version of this module then please see the original: [@Belphemur&nbsp;/&nbsp;node-json-db][Original].

# Usage

## Importing

ES2017+:

```javascript
import DBDotJSON from 'db-dot-json'
```
ES2016 (node only):

```javascript
const DBDotJSON = require('db-dot-json')
```

If you just need access to a simple set of DB data:

```javascript
const db = require('db-dot-json').loadSync({
	file: [__dirname, '../', 'db.json'], ...opts
})
```

## Usage

From this point you can simply extend the class from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)s' Classes explanation:

```javascript
class myDB extends DBDotJSON {
	constructor(opts) {
		super(opts)
	}

	myMethod(params) {
		// ...
	}

	toJSON() { // default method. Can be modified to be some reducer if needed.
		return this.state
	}

	static loadSync(opts = {}) {
		return new myDB(opts).loadSync()
	}

	// ...
}

let db = new myDB({file: [__dirname, '../', 'db.json'], ...opts})
```


# Options

* `opts` (type: `Object`):
	* `file` (type: `String` or `Array`): Where to save the data base or file name. Default `db.json`. When `Array`, join values with `path.join`
	* `filename` (type: `String`): Overrides file. Default `file === filename`.
	* `init` (type: `*`): The initial state of the database. Default `{type: 'DBDotJSON'}`.
	* [JSON.stringify options][JSON.stringify]:
		* `replacer` (type: `Function` or `Array`): `JSON.stringify` replacer. Default `null`
		* `humanReadable` (type: `Number` or `String`): `JSON.stringify` spaces. Default `0`
	* [JSON.parse options][JSON.parse]:
		* `reviver` (type: `Function`): Reviver for JSON.parse data. Default `null`
	* `exists` (type: `Function`): Returns `true` if the file exists, or false otherwise. Default `fs.existsSync(file)`
	* `mkdir` (type: `Function`): What is used to create the folders. Default `mkdirp.sync`
	* `dirname` (type: `Function` or `String`): Resolver or directory to write filename. Default `(file) => path.dirname(file)`
	* `read` (type: `Function`): Should be synchronous or return a `Promise` resolving to parsable JSON. Default `(name=file) => fs.readFileSync(name, 'utf8')`
	* `save` (type: `Function`): Should be synchronous or return a `Promise`. Default `(data,name=file) => fs.writeFileSync(name,data,'utf8')`
	* `setup` (type: `Function`): Synchronous function, default loads the DB.
	* `pjoin` (type: `Function`): Joins an array of folder names.

[JSON.stringify]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify "JSON.stringify() on MDN"
[JSON.parse]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse "JSON.parse() on MDN"
[Options]: #options
[Original]: https://github.com/Belphemur/node-json-db
