const express = require('express')

module.exports = ({ posts }) => {
  const router = express.Router()

  router.route('/posts')
    .get(
      async (req, res) => {
        try {
          const { limit = 10, offset = 0 } = req.query
          // const companyID = req.headers['company-id']

          const [postsList, countRows] = await Promise.all([
            posts.getAllPostsList(offset, limit),
            posts.getCountAllPosts()
          ])

          return res.status(200).json({
            posts: postsList,
            count: countRows,
            message: 'Posts list retrieved successfully'
          })
        } catch (error) {
          res.status(500).send(error)
        }
      })
    .delete(
      async (req, res) => {
        try {
          const { id } = req.body

          await posts.deletePost(id)

          return res.status(200).json({
            message: 'Post deleted successfully'
          })
        } catch (error) {
          res.status(500).send(error)
        }
      }
    )
  return router
}

// Post comments totales
// comments totales
