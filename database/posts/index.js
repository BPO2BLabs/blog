const { uuid, isUuid } = require('uuidv4')
const conn = require('../connection')

function getPostsList (userId, offset = 0, limit = 10) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
      SELECT post_id, content, create_date, file_name, user_id
      FROM posts
      WHERE user_id = ?
      LIMIT ?, ?
      `
      const params = [userId, offset, limit]
      conn.execute(sql, params, (err, rows) => {
        if (err) { reject(err) }
        resolve(rows)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function insertPost (post) {
  try {
    const { userId, content, fileName } = post
    const createdAt = new Date(Date.now()).toISOString()
    const id = uuid()
    const sql = `
    INSERT INTO posts (post_id, user_id, content, create_date, file_name)
    VALUES (?, ?, ?, ?, ?)
    `
    const params = [id, userId, content, createdAt, fileName]
    conn.query(sql, params)
  } catch (err) {
    throw new Error(err)
  }
}

function getPost (postId) {
  if (!isUuid(postId)) { return null }
  return new Promise((resolve, reject) => {
    try {
      const sql = `
      SELECT post_id, content, create_date, file_name, user_id
      FROM posts
      WHERE post_id = ?
      `
      const params = [postId]
      conn.query(sql, params, (err, rows) => {
        if (err) { reject(err) }
        resolve(rows[0])
      })
    } catch (err) {
      reject(err)
    }
  })
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
