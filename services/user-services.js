const bcrypt = require('bcrypt')
const { User } = require('../models')

const userServices = {
  signUp: (req, cb) => {
    const { name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) throw new Error('密碼不一致')
    User.findOne({
      where: { email }
    })
      .then(user => {
        if (user) throw new Error('用戶已存在')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({ name, email, password: hash }))
      .then(user => cb(null, user))
      .catch(err => cb(err))
  }
}

module.exports = userServices
