const express = require('express')

module.exports = (_db, { fileManager }) => {
  const router = express.Router()

  router.get('/:documentId', async (req, res) => {
    const { documentId } = req.params
    const { name, pipe } = await fileManager.download(documentId)
    res.attachment(name)
    pipe.pipe(res)
  })

  return router
}
