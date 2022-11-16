const { uuid, isUuid } = require('uuidv4')
const conn = require('../connection')

function getCommentsList (postId, offset, limit) {
  if (!isUuid(postId)) { return null }
  return new Promise((resolve, reject) => {
    try {
      const sql = `
      SELECT comment_id, content, create_date, user_id, file_name
      FROM comments
      WHERE post_id = ?
      LIMIT ?, ?
      `
      const params = [postId, offset, limit]
      conn.query(sql, params, (err, rows) => {
        if (err) { reject(err) }
        resolve(rows)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function insertComment (comment) {
  try {
    const { userId, postId, content, fileName } = comment
    const createdAt = new Date(Date.now()).toISOString()
    const id = uuid()
    const sql = `
    INSERT INTO comments (comment_id, user_id, post_id, content, create_date, file_name)
    VALUES (?, ?, ?, ?, ?, ?)
    `
    const params = [id, userId, postId, content, createdAt, fileName]
    conn.query(sql, params)
    return id
  } catch (err) {
    throw new Error(err)
  }
}

function getComment (commentId) {
  if (!isUuid(commentId)) { return null }
  return new Promise((resolve, reject) => {
    try {
      const sql = `
      SELECT comment_id, content, create_date, user_id, file_name
      FROM comments
      WHERE comment_id = ?
        `
      const params = [commentId]
      conn.query(sql, params, (err, rows) => {
        if (err) { reject(err) }
        resolve(rows[0])
      })
    } catch (err) {
      reject(err)
    }
  })
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
