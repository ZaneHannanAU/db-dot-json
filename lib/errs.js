export class NestedError extends Error {
  constructor(msg, id, nested) {
    var tmp = super.apply(this, arguments)
    tmp.name = this.name = 'NestedError'

    this.stack = tmp.stack
    this.message = tmp.message
    this.inner = nested
    this.id = id
  }
  toString() {
    return `${this.name}: ${this.message}${this.inner ? ':\n'+this.inner : ''}`
  }
}

export class DatabaseError extends NestedError {
  constructor(msg, id, nested) {
    this.name = 'DatabaseError'
  }
}

export class DataError extends NestedError {
  constructor(msg, id, nested) {
    this.name = 'DataError'
  }
}
