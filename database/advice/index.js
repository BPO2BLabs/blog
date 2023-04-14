const conn = require('../connection')

function insertManyAdviceGlobal (postID, allowedCompanies) {
  const query = 'INSERT INTO advice (post_id, company_id) VALUES ?'
  return new Promise((resolve, reject) => {
    conn.query(query, [allowedCompanies.map(company => [postID, company])], (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

module.exports = {
  insertManyAdviceGlobal
}
