const DB = require('../')
const path = require('path');

const db = new DB([__dirname, 'db.json'], {init: []})

db.load().then(console.log, console.error)
