const { isUuid } = require('uuidv4')
const { verifyToken } = require('../secureConsult/index')

function validatePaginationQueries (req, res, next) {
  let { limit = 10, offset = 0 } = req.query

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
  if (limit > 10) { limit = 10 }

  req.query.offset = offset.toString()
  req.query.limit = limit.toString()
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

function validateToken (req, res, next) {
  const { token } = req.headers
  if (!token) { return res.status(401).json({ message: 'Token is required' }) }
  try {
    const decoded = verifyToken(token)
    req.user = decoded.user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = {
  validatePaginationQueries,
  validateUserId,
  validateContent,
  validatePostId,
  validateToken
}
