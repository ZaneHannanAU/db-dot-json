export class NestedError extends Error {
  constructor(msg, id, nested) {
    super(msg, id, nested)
    this.name = 'NestedError'
    this.inner = nested
    this.id = id
  }
  toString() {
    return `${this.name}: ${this.message}${this.inner ? ':\n'+this.inner : ''}`
  }
}

export class DatabaseError extends NestedError {
  constructor(msg, id, nested) {
    super(msg, id, nested)
    this.name = 'DatabaseError'
  }
}

export class DataError extends NestedError {
  constructor(msg, id, nested) {
    super(msg, id, nested)
    this.name = 'DataError'
  }
}
