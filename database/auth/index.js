const conn = require('../connection')

function getUserByUsername (username) {
  return new Promise((resolve, reject) => {
    try {
      const sql = `
      SELECT *
      FROM users
      WHERE username = ?
      `
      const params = [username]
      conn.execute(sql, params, (err, results) => {
        if (err) { reject(err) }
        resolve(results[0])
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = { getUserByUsername }
