const express = require('express')
const { validatePaginationQueries, validateUserId, validateContent, validatePostId } = require('../../utils/validationForComponents/index')

module.exports = ({ comments }, { fileManager }) => {
  const router = express.Router()

  router.route('/')
    .get(validatePostId, validatePaginationQueries, async (req, res) => {
      try {
        const { limit = 10, offset = 0 } = req.query
        const { postId } = req.body

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
    .post(validatePostId, validateUserId, validateContent, async (req, res) => {
      try {
        const { userId, content, postId } = req.body
        const files = []
        if (req.files && req.files.attachment && req.files.attachment.length > 0) {
          const { attachment } = req.files
          const result = await Promise.all(attachment.map((file) => fileManager.upload(file)))
          files.push(...result)
        }

        const comment = {
          userId,
          content,
          fileName: JSON.stringify({ files }),
          postId
        }

        const commentId = await comments.insertComment(comment)

        return res.status(201).json({
          message: 'Comment created successfully',
          commentId
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
