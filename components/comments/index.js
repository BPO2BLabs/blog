const express = require('express')

module.exports = ({ comments }, { fileManager, validationComponent }) => {
  const router = express.Router()

  router.route('/')
    .post(
      validationComponent.validatePostId,
      validationComponent.validateUserId,
      validationComponent.validateContent,
      async (req, res) => {
        try {
          const companyID = req.headers['company-id']
          const { userId, content, postId, userName } = req.body
          const files = await fileManager.uploadFiles(req.files)

          const comment = {
            userId,
            content,
            fileName: JSON.stringify({ files }),
            postId,
            userName,
            companyID
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

  router.route('/list')
    .post(
      validationComponent.validatePostId,
      validationComponent.validatePaginationQueries,
      async (req, res) => {
        try {
          let { limit = 10, offset = 0 } = req.query
          limit = parseInt(limit)
          offset = parseInt(offset)
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

  router.route('/comment/:commentId')
    .get(
      async (req, res) => {
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
    .delete(
      async (req, res) => {
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
