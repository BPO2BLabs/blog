const { isUuid } = require('uuidv4')

function validatePaginationQueries (req, res, next) {
  const { limit = 10, offset = 0 } = req.query

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
  if (limit > 10) { req.query.limit = 10 }
  next()
}

function validateUserId (req, res, next) {
  const { userId } = req.body
  if (!userId) { return res.status(400).json({ message: 'User ID is required' }) }
  next()
}

function validateContent (req, res, next) {
  const { content } = req.body
  if (!content) { return res.status(400).json({ message: 'Content is required' }) }
  next()
}

function validatePostId (req, res, next) {
  const { postId } = req.body
  if (!postId) { return res.status(400).json({ message: 'Post ID is required' }) }
  if (!isUuid(postId)) { return res.status(400).json({ message: 'Post ID is not valid' }) }

  next()
}

module.exports = {
  validatePaginationQueries,
  validateUserId,
  validateContent,
  validatePostId
}
