const DB = require('../')

const dbObject = new DB({
  file: [__dirname, 'db.object.json'],
  init: {},
  saveOnPush: false
})
// Any other datatype with a toJSON() caller is accepted, or similar.

// dbArray
// .push('0', {hi: 'three'})
// .then(db => db.save())
// .then(console.log)
// .catch(console.error)

let hi2 = {'object': [...'array']}
dbObject
.push('/hi/', hi2)
.then(db => db.save())
.then(console.log)
.catch(console.error)
