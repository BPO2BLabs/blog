const express = require('express')

module.exports = ({ posts, advice }, { fileManager }) => {
  const router = express.Router()

  router.route('/posts')
    .get(
      async (req, res) => {
        try {
          const { limit = 10, offset = 0 } = req.query

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
    .post(
      async (req, res) => {
        try {
          const companyID = req.headers['company-id']
          const { userId, userName, content, allowedCompanies, isolated = false } = req.body
          const files = await fileManager.uploadFiles(req.files)

          const post = {
            userId,
            content,
            fileName: JSON.stringify({ files }),
            userName,
            companyID
          }

          if (isolated) {
            const ids = await posts.insertManyReplicaPosts(post, allowedCompanies.length)
            await advice.insertManyAdviceIsolated(ids, allowedCompanies)
            return res.status(200).json({
              postID: ids,
              message: 'Post created successfully'
            })
          } else {
            const postID = await posts.insertPost(post)
            await advice.insertManyAdviceGlobal(postID, allowedCompanies)
            return res.status(200).json({
              postID,
              message: 'Post created successfully'
            })
          }
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
