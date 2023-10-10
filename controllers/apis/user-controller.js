const jwt = require('jsonwebtoken')
const userServices = require('../../services/user-services')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, user) =>
      err ? next(err) : res.json({ status: 'success', user })
    )
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, (err, user) => {
      err ? next(err) : res.json({ status: 'success', user })
    })
  },
  addFavorite: (req, res, next) => {
    userServices.addFavorite(req, (err, favorite) => {
      err ? next(err) : res.json({ status: 'success', favorite })
    })
  },
  removeFavorite: (req, res, next) => {
    userServices.removeFavorite(req, (err, favorite) => {
      err ? next(err) : res.json({ status: 'success', favorite })
    })
  },
  addLike: (req, res, next) => {
    userServices.addLike(req, (err, like) =>
      err ? next(err) : res.json({ status: 'success', like })
    )
  },
  removeLike: (req, res, next) => {
    userServices.removeLike(req, (err, like) =>
      err ? next(err) : res.json({ status: 'success', like })
    )
  },
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, users) =>
      err ? next(err) : res.json({ status: 'success', users })
    )
  },
  addFollowing: (req, res, next) => {
    userServices.addFollowing(req, (err, followship) =>
      err ? next(err) : res.json({ status: 'success', followship })
    )
  },
  removeFollowing: (req, res, next) => {
    userServices.removeFollowing(req, (err, followship) =>
      err ? next(err) : res.json({ status: 'success', followship })
    )
  },
  getFollowing: (req, res, next) => {
    userServices.getFollowing(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  }
}

module.exports = userController
