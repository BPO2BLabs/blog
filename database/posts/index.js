const { uuid, isUuid } = require('uuidv4')
const conn = require('../connection')

function getCountAllPosts () {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
      SELECT COUNT(*) AS rowsCount
      FROM posts
      `
      conn.execute(sql, (err, rows) => {
        if (err) { reject(err) }
        resolve(rows[0].rowsCount)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function getCountAllPostByCompany (companyID) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
      SELECT COUNT(*) AS rowsCount
      FROM posts
      WHERE company_id = ?
      `
      const params = [companyID]

      conn.execute(sql, params, (err, rows) => {
        if (err) { reject(err) }
        resolve(rows[0].rowsCount)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function getAllPostsList (offset = 0, limit = 10) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
      SELECT *
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

function getPostsList (userId, offset = 0, limit = 10) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
      SELECT *
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

function getRecentPostsList (offset = 0, limit = 10, companyID) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
      SELECT *
      FROM posts
      WHERE company_id = ?
      ORDER BY create_date DESC
      LIMIT ?, ?
      `
      const params = [companyID, offset, limit]
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
    const { userId, content, fileName, userName, companyID } = post
    const id = uuid()
    const currentDate = new Date(Date.now()).toISOString()
    const sql = `
    INSERT INTO posts (post_id, user_id, content, file_name, create_date, user_name, company_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const params = [id, userId, content, fileName, currentDate, userName, companyID]
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
      SELECT *
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
  deletePost,
  getAllPostsList,
  getCountAllPostByCompany,
  getCountAllPosts
}
