const express = require('express')
const bcrypt = require('bcryptjs')

module.exports = ({ auth }, { secureConsult }) => {
  const router = express.Router()

  router.route('/')
    .post(
      async (req, res) => {
        try {
          const { username, password } = req.body
          const user = await auth.getUserByUsername(username)
          if (!user) { return res.status(401).json({ message: 'Invalid username or password' }) }

          const validPassword = await bcrypt.compare(password, user.password)
          if (!validPassword) { return res.status(401).json({ message: 'Invalid username or password' }) }

          const token = secureConsult.signToken(username)
          res.status(200).json({ token })
        } catch (err) {
          res.status(500).json({ error: err.message })
        }
      }
    )

  return router
}
