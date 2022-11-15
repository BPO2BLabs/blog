const { uuid, isUuid } = require('uuidv4')
const conn = require('../connection')

function getPostsList (userId, offset = 0, limit = 10) {
  try {
    const sql = `
    SELECT post_id, content, create_date, file_name, file_url, user_id
    FROM posts
    WHERE user_id = ?
    LIMIT ?, ?
    ORDER BY create_date DESC
    `
    const params = [userId, offset, limit]
    const [rows] = conn.query(sql, params)
    return rows
  } catch (err) {
    throw new Error(err)
  }
}

function insertPost (post) {
  try {
    const { userId, content, fileName, fileUrl } = post
    const createdAt = new Date(Date.now()).toISOString()
    const id = uuid()
    const sql = `
    INSERT INTO posts (post_id, user_id, content, create_date, file_name, file_url)
    VALUES (?, ?, ?, ?, ?, ?)
    `
    const params = [id, userId, content, createdAt, fileName, fileUrl]
    conn.query(sql, params)
  } catch (err) {
    throw new Error(err)
  }
}

function getPost (postId) {
  if (!isUuid(postId)) { return null }
  try {
    const sql = `
    SELECT post_id, content, create_date, file_name, file_url, user_id
    FROM posts
    WHERE post_id = ?
    `
    const params = [postId]
    const [rows] = conn.query(sql, params)
    return rows[0]
  } catch (err) {
    throw new Error(err)
  }
}

function deletePost (postId) {
  if (!isUuid(postId)) { return null }
  try {
    const sql = `
    DELETE FROM posts
    WHERE post_id = ?
    `
    const params = [postId]
    conn.query(sql, params)
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  insertPost,
  getPostsList,
  getPost,
  deletePost
}
