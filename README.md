---

---

# db-dot-json

A near fork of @Belphemur/node-json-db with more options and Bower/requireJS compatibility.

# Promises

Many of the functions used in this return a `Promise`.

This is to allow the level of customisability that is offered (See [options][Options]) as well as chaining and multi-writing via `Promise.all` and/or `Promise.resolve(...).then(val => {})` chains.

If you would like a synchronous version of this module then please see the original version [@Belphemur&nbsp;/&nbsp;node-json-db][Original]. It lacks the same options but, by default, works in almost the exact same way.

# Options

* `opts` (type: `Object`):
	* `file` (type: `String` or `Array`): Where to save the data base or file name. Default `db.json`. When `Array`, join values with '/'
	* `filename` (type: `String`): Overrides file. Default `file === filename`.
	* `saveOnPush` (type: `Boolean`): Saving on adding to the data. Default `true`.
	* `saveOnDel` (type: `Boolean`): Saving on deleting any data. Default `saveOnDel === saveOnPush`.
	* `init` (type: `*`): The initial state of the database. Default `{}`.
	* `overwrite` (type: `Boolean`): Whether to overwrite data (by default) when pushing. Default `true`.
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
	* `presetup` (type: `Function`): Synchronous function

[JSON.stringify]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify "JSON.stringify() on MDN"
[JSON.parse]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse "JSON.parse() on MDN"
[Options]: #options
[Original]: https://github.com/Belphemur/node-json-db
