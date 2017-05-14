import ArrayInfo from './array-info.js'

let arrayIndexRegex = /(.*)\[(.+|)\]/

/**
  * Check if the property want to access an Array
  * @returns {ArrayInfo|null}
  */
let processArray = prop => {
  let match = arrayIndexRegex.exec(prop)
  if (match != null)
    return new ArrayInfo(match[1], match[2])
  else return null
}

//
// Code from github.com/rxaviers/cldr
//
let merge = (...srcs) => {
  var dest = {}
  srcs.forEach(src => {
    for (var prop in src) {
      if (prop in dest && dest[prop] === null)
        dest[prop] = src[prop];
      else if (prop in dest && Array.isArray(dest[prop]))
        // concat Arrays
        dest[prop] = dest[prop].concat(src[prop])
      else if (prop in dest && typeof dest[prop] === 'object')
        // merge Objects
        dest[prop] = merge(dest[prop], src[prop])
      else
        // set new vals
        dest[prop] = src[prop]
    }
  })
  return dest;
}

/**
  * Removes edge slashes from a given datapath
  * @param {String} dataPath
  * @returns {String}
  */
let removeEdgeSlashes = dataPath => dataPath.replace(/^\/|\/$/gm, '')

export default {processArray, merge, removeEdgeSlashes}
export {processArray, merge, removeEdgeSlashes}
