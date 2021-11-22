const express = require('express')
const { ResourceNotFoundError } = require('./errors')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/status', function (req, res, next) {
  res.send({status: 'ok'})
})

module.exports = app
