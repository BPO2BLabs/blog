const express = require('express')

module.exports = ({ posts }, { fileManager }) => {
  const router = express.Router()

  router.route('/')
    .get(async (req, res) => {
      try {
        let { limit = 10, offset = 0 } = req.query
        const { userId } = req.body

        if (!userId) { return res.status(400).json({ message: 'userId is required' }) }
        if (limit > 10) { limit = 10 }
        if (limit < 1 || offset < 0) {
          return res.status(400).json({
            message: 'Limit or offset are too low',
            posts: []
          })
        }
        if (isNaN(limit) || isNaN(offset)) {
          return res.status(400).json({
            message: 'Limit and offset must be numbers',
            posts: []
          })
        }

        const postsList = await posts.getPostsList(userId, offset, limit)

        return res.status(200).json({
          message: 'Posts retrieved successfully',
          posts: postsList
        })
      } catch (err) {
        res.status(500).json({
          message: err.message
        })
      }
    })
    .post(async (req, res) => {
      try {
        const { userId, content } = req.body
        let fileName = ''
        if (req.files && req.files.attachment) {
          const { attachment } = req.files
          const key = await fileManager.upload(attachment)
          fileName = key
        }

        if (!userId) { return res.status(400).json({ message: 'User ID is required' }) }
        if (!content) { return res.status(400).json({ message: 'Content is required' }) }

        const post = {
          userId,
          content,
          fileName
        }

        const postId = await posts.insertPost(post)

        return res.status(201).json({
          message: 'Post created successfully',
          postId
        })
      } catch (err) {
        res.status(500).json({
          message: err.message
        })
      }
    })

  router.route('/:postId')
    .get(async (req, res) => {
      try {
        const { postId } = req.params

        const post = await posts.getPost(postId)

        if (!post) {
          return res.status(404).json({
            message: 'Post not found'
          })
        }

        return res.status(200).json({
          message: 'Post retrieved successfully',
          post
        })
      } catch (err) {
        res.status(500).json({
          message: err.message
        })
      }
    })
    .delete(async (req, res) => {
      try {
        const { postId } = req.params

        await posts.deletePost(postId)

        return res.status(200).json({
          message: 'Post deleted successfully'
        })
      } catch (err) {
        res.status(500).json({
          message: err.message
        })
      }
    })

  return router
}
