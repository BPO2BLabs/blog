const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const app = express()
const router = require('./components/index')
const log = true

module.exports = (database = {}, utils = {}) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(fileUpload())
  app.use(cors({ origin: '*' }))
  router(app, database, utils)

  return app
}
