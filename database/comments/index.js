const { uuid, isUuid } = require('uuidv4')
const conn = require('../connection')

function getCommentsList (postId, offset, limit) {
  if (!isUuid(postId)) { return null }
  try {
    const sql = `
    SELECT comment_id, content, create_date, user_id, file_name, file_url
    FROM comments
    WHERE post_id = ?
    LIMIT ?, ?
    ORDER BY create_date DESC
    `
    const params = [postId, offset, limit]
    const [rows] = conn.query(sql, params)
    return rows
  } catch (err) {
    throw new Error(err)
  }
}

function insertComment (comment) {
  try {
    const { userId, postId, content, fileName, fileUrl } = comment
    const createdAt = new Date(Date.now()).toISOString()
    const id = uuid()
    const sql = `
    INSERT INTO comments (comment_id, user_id, post_id, content, create_date, file_name, file_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const params = [id, userId, postId, content, createdAt, fileName, fileUrl]
    conn.query(sql, params)
  } catch (err) {
    throw new Error(err)
  }
}

function getComment (commentId) {
  if (!isUuid(commentId)) { return null }
  try {
    const sql = `
    SELECT comment_id, content, create_date, user_id, file_name, file_url
    FROM comments
    WHERE comment_id = ?
    `
    const params = [commentId]
    const [rows] = conn.query(sql, params)
    return rows[0]
  } catch (err) {
    throw new Error(err)
  }
}

function deleteComment (commentId) {
  if (!isUuid(commentId)) { return null }
  try {
    const sql = `
    DELETE FROM comments
    WHERE comment_id = ?
    `
    const params = [commentId]
    conn.query(sql, params)
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  getCommentsList,
  insertComment,
  getComment,
  deleteComment
}
