class UnexpectedError extends Error {
  constructor(value) {
    super(value)
  }
}

class RouteNotFoundError extends Error {
  constructor(value) {
    super(value)
  }
}

module.exports = {
  UnexpectedError,
  RouteNotFoundError,
}
