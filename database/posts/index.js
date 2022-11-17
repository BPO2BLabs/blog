const { uuid, isUuid } = require('uuidv4')
const conn = require('../connection')

function getPostsList (userId, offset = 0, limit = 10) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
      SELECT post_id, content, create_date, file_name, user_id
      FROM posts
      WHERE user_id = ?
      ORDER BY create_date DESC
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

function getRecentPostsList (offset = 0, limit = 10) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
      SELECT post_id, content, create_date, file_name, user_id
      FROM posts
      ORDER BY create_date DESC
      LIMIT ?, ?
      `
      const params = [offset, limit]
      conn.execute(sql, params, (err, rows) => {
        if (err) { reject(err) }
        resolve(rows)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function getRecentRepliedPostsList (userId, offset, limit) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
      SELECT posts.*
      FROM comments
      INNER JOIN posts ON comments.post_id = posts.post_id
      WHERE comments.user_id = ?
      GROUP BY comments.post_id
      ORDER BY create_date DESC
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
    const id = uuid()
    const sql = `
    INSERT INTO posts (post_id, user_id, content, file_name)
    VALUES (?, ?, ?, ?)
    `
    const params = [id, userId, content, fileName]
    conn.query(sql, params)
    return id
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
  getRecentPostsList,
  getRecentRepliedPostsList,
  deletePost
}
