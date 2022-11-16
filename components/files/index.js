const express = require('express')

module.exports = (_db, { fileManager }) => {
  const router = express.Router()

  router.get('/:documentId', async (req, res) => {
    const { documentId } = req.params
    try {
      const { name, pipe } = await fileManager.download(documentId)
      res.attachment(name)
      pipe.pipe(res)
    } catch (err) {
      res.status(404).send('File not found')
    }
  })

  return router
}
