const DB = require('../')

// const dbArray = new DB([__dirname, 'db.array.json'], {init: []})
const dbObject = new DB([__dirname, 'db.object.json'], {init: {}, saveOnPush: false})
// Any other datatype with a toJSON() caller is accepted, or similar.

// dbArray
// .push('0', {hi: 'three'})
// .then(db => db.save())
// .then(console.log)
// .catch(console.error)

let hi2 = {'object': [...'array']}
dbObject
.push('/hi/', 'text')
.then(db => db.push('e', hi2))
.then(db => db.push('/d', hi2))
.then(db => db.push('/hi2', hi2))
.then(db => db.save())
.then(console.log)
.catch(console.error)
