const express = require('express')
const { validatePaginationQueries, validateUserId, validateContent } = require('../../utils/validationForComponents/index')

module.exports = ({ posts }, { fileManager }) => {
  const router = express.Router()

  router.route('/')
    .get(validatePaginationQueries, async (req, res) => {
      try {
        const { limit = 10, offset = 0 } = req.query

        const postsList = await posts.getRecentPostsList(offset, limit)

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
    .post(validateUserId, validateContent, async (req, res) => {
      try {
        const { userId, content } = req.body
        const files = []
        if (req.files && req.files.attachment && req.files.attachment.length > 0) {
          const { attachment } = req.files
          const result = await Promise.all(attachment.map((file) => fileManager.upload(file)))
          files.push(...result)
        }

        const post = {
          userId,
          content,
          fileName: JSON.stringify({ files })
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
    .post(validatePaginationQueries, validateUserId, async (req, res) => {
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
    .post(validatePaginationQueries, validateUserId, async (req, res) => {
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
