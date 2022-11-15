const posts = require('./posts/index')
const comments = require('./comments/index')
const files = require('./files/index')

module.exports = (app, database, utils) => {
  app.use('/posts', posts(database, utils))
  app.use('/comments', comments(database, utils))
  app.use('/files', files(database, utils))
}
