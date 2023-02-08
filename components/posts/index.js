const express = require('express')

module.exports = ({ posts }, { fileManager, validationComponent }) => {
  const router = express.Router()

  router.route('/')
    .get(
      validationComponent.validatePaginationQueries,
      async (req, res) => {
        try {
          const { limit = 10, offset = 0 } = req.query
          const { companyID } = req.headers['Company-ID']

          const postsList = await posts.getRecentPostsList(offset, limit, companyID)

          return res.status(200).json({
            message: 'Recent posts retrieved successfully',
            posts: postsList
          })
        } catch (err) {
          res.status(500).json({
            message: err.message
          })
        }
      })
    .post(
      validationComponent.validateUserId,
      validationComponent.validateContent,
      async (req, res) => {
        try {
          const { userId, userName, companyID, content } = req.body
          const files = await fileManager.uploadFiles(req.files)

          const post = {
            userId,
            content,
            fileName: JSON.stringify({ files }),
            userName,
            companyID
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

  router.route('/user')
    .post(
      validationComponent.validatePaginationQueries,
      validationComponent.validateUserId,
      async (req, res) => {
        try {
          const { limit = 10, offset = 0 } = req.query
          const { userId } = req.body

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

  router.route('/replied')
    .post(
      validationComponent.validatePaginationQueries,
      validationComponent.validateUserId,
      async (req, res) => {
        try {
          const { limit = 10, offset = 0 } = req.query
          const { userId } = req.body

          const postsList = await posts.getRecentRepliedPostsList(userId, offset, limit)

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

  router.route('/:postId')
    .get(
      async (req, res) => {
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
    .delete(
      async (req, res) => {
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
