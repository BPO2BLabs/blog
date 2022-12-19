const posts = require('./posts/index')
const comments = require('./comments/index')
const files = require('./files/index')
const auth = require('./auth/index')
const consult = require('./consult/index')

module.exports = (app, database, utils) => {
  app.use('/posts', posts(database, utils))
  app.use('/comments', comments(database, utils))
  app.use('/files', files(database, utils))
  app.use('/auth', auth(database, utils))
  app.use('/consult', consult(database, utils))
}
