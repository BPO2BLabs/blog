const express = require('express')

module.exports = ({ posts }, { validationComponent }) => {
  const router = express.Router()

  router.route('/posts')
    .post(
      validationComponent.validateToken,
      async (req, res) => {
        try {
          const { limit = '100' } = req.query
          const { companyID } = req.body
          if (limit < 1) { return res.status(400).json({ message: 'Limit must be greater than 0' }) }

          const postsList = await posts.getRecentPostsList('0', limit, companyID)
          res.status(200).json({ posts: postsList })
        } catch (err) {
          res.status(500).json({ error: err.message })
        }
      }
    )

  router.route('/comments')
    .post(
      validationComponent.validateToken,
      async (req, res) => {
        try {
          const { limit = 100 } = req.query
          const { userID } = req.body
          if (limit < 1) { return res.status(400).json({ message: 'Limit must be greater than 0' }) }

          const commentsList = await posts.getRecentRepliedPostsList(userID, 0, limit)
          res.status(200).json({ comments: commentsList })
        } catch (err) {
          res.status(500).json({ error: err.message })
        }
      }
    )

  return router
}
