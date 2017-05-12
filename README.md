---

---

# db-dot-json

A near fork of @Belphemur/node-json-db with more options and Bower/requireJS compatibility.

# Promises

Many of the functions used in this return a `Promise`.

This is to allow the level of customisability that is offered (See [options][Options]) as well as chaining and multi-writing via `Promise.all` and/or `Promise.resolve(...).then(val => {})` chains.

If you would like a synchronous version of this module then please see the original version [@Belphemur&nbsp;/&nbsp;node-json-db][Original]. It lacks the same options but, by default, works in almost the exact same way.

# Options

* `filename` (type: `String` or `Array`): Where to save the data base or file name. Default `db.json`. When `Array`, join values with '/'
* `opts` (type: `Object`):
	* `file` (type: `String`): Overrides filename. Default `file === filename`.
	* `saveOnPush` (type: `Boolean`): Saving on adding to the data. Default `true`.
	* `saveOnDel` (type: `Boolean`): Saving on deleting any data. Default `saveOnDel === saveOnPush`.
	* `init` (type: `*`): The initial state of the database. Default `{}`.
	* `overwrite` (type: `Boolean`): Whether to overwrite data (by default) when pushing. Default `true`.
	* [JSON.stringify options][JSON.stringify]:
		* `replacer` (type: `Function` or `Array`): `JSON.stringify` replacer.
		* `humanReadable` (type: `Number` or `String`): `JSON.stringify` spaces.
	* [JSON.parse options][JSON.parse]:
		* `reviver` (type: `Function`): Reviver for JSON.parse data.
	* `exists` (type: `Function`): Returns `true` if the file exists, or false otherwise.
	* `mkdir` (type: `Function`): What is used to create the folders.
	* `dirname` (type: `Function` or `String`): Resolver or directory to write filename.
	* `read` (type: `Function`): Should be synchronous or return a `Promise` resolving to parsable JSON.
	* `save` (type: `Function`): Should be synchronous or return a `Promise`.


[JSON.stringify]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify "JSON.stringify() on MDN"
[JSON.parse]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse "JSON.parse() on MDN"
[Options]: #options
[Original]: https://github.com/Belphemur/node-json-db
