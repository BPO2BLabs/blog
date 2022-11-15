const express = require('express')

module.exports = ({ comments }, { fileManager }) => {
  const router = express.Router()

  router.route('/')
    .get(async (req, res) => {
      try {
        let { limit = 10, offset = 0 } = req.query
        const { postId } = req.body

        if (!postId) { return res.status(400).json({ message: 'PostId is required' }) }
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

        const commentsList = await comments.getCommentsList(postId, offset, limit)

        return res.status(200).json({
          message: 'Comments retrieved successfully',
          comments: commentsList
        })
      } catch (err) {
        res.status(500).json({
          message: err.message
        })
      }
    })
    .post(async (req, res) => {
      try {
        const { userId, content, postId } = req.body
        let fileName = ''
        if (req.files && req.files.attachment) {
          const { attachment } = req.files
          const key = await fileManager.upload(attachment)
          fileName = key
        }

        if (!userId) { return res.status(400).json({ message: 'User ID is required' }) }
        if (!content) { return res.status(400).json({ message: 'Content is required' }) }
        if (!postId) { return res.status(400).json({ message: 'Post ID is required' }) }

        const comment = {
          userId,
          content,
          fileName,
          postId
        }

        await comments.insertComment(comment)

        return res.status(201).json({
          message: 'Comment created successfully'
        })
      } catch (err) {
        res.status(500).json({
          message: err.message
        })
      }
    })

  router.route('/:commentId')
    .get(async (req, res) => {
      try {
        const { commentId } = req.params

        const comment = await comments.getComment(commentId)

        if (!comment) {
          return res.status(404).json({
            message: 'Comment not found'
          })
        }

        return res.status(200).json({
          message: 'Comment retrieved successfully',
          comment
        })
      } catch (err) {
        res.status(500).json({
          message: err.message
        })
      }
    })
    .delete(async (req, res) => {
      try {
        const { commentId } = req.params

        await comments.deleteComment(commentId)

        return res.status(200).json({
          message: 'Comment deleted successfully'
        })
      } catch (err) {
        res.status(500).json({
          message: err.message
        })
      }
    })

  return router
}
