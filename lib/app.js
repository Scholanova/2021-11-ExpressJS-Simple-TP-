const express = require('express')
const { ResourceNotFoundError, RouteNotFoundError } = require('./errors')
const dependency = require('./dependency')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/status', function (req, res, next) {
  res.send({ status: 'ok' })
})

app.get('/number', (req, res) => {
  dependency.getRandomNumber()
    .then((randomNumber) => {
      res.status(200).json({ number: randomNumber })
    })
})

app.post('/multiply', (req, res, next) => {
  const requestNumber = req.body.number
  const isRequestNumberAbsent = requestNumber === undefined

  if (isRequestNumberAbsent) {
    res.status(400).json({ error: 'number is absent from request body' })
  } else {
    dependency.getRandomNumber()
      .then((randomNumber) => {
        const responseNumber = requestNumber * randomNumber
        const isNumberTooBig = responseNumber > 1024
        if (isNumberTooBig) {
          res.status(422).json({ error: 'multiplied number is too big' })
        } else {
          res.status(200).json({ number: responseNumber })
        }
      })
      .catch(error => next(error))
  }
})

app.use((req, res, next) => {
  const routeNotFoundError = new RouteNotFoundError()
  next(routeNotFoundError)
})

app.use((error, req, res, next) => {
  switch (error.constructor) {
    case RouteNotFoundError:
      res.status(404).json({ error: 'route not found' })
      break
    default:
      res.status(500).json({ error: 'unexpected error' })
  }
})

module.exports = app
