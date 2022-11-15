const posts = require('./posts/index')
const comments = require('./comments/index')

module.exports = (app, database, utils) => {
  app.use('/posts', posts(database, utils))
  app.use('/comments', comments(database, utils))
}
