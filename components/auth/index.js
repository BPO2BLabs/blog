const express = require('express')

module.exports = (_, {}) => {
  const router = express.Router()

  router.post('/', (req, res) => {
    res.send('Hello World')
  })

  return router
}
