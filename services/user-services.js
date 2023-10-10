const bcrypt = require('bcrypt')
const { Restaurant, Comment, User, Favorite, Like, Followship } = require('../models')
const { localFileHandler } = require('../helpers/file-helper')

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
  },
  getUser: (req, cb) => {
    const id = req.params.id
    return Promise.all([
      User.findByPk(id, {
        include: { model: Comment, include: Restaurant }
      }),
      Comment.findAndCountAll({
        where: { userId: id },
        raw: true
      })
    ])

      .then(([user, comment]) => {
        if (!user) throw new Error("User didn't exist")
        return cb(null, { user: user.toJSON(), comment })
      })
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    const { name } = req.body
    const userId = req.user.id
    if (!name) throw new Error('User name is required')
    const id = Number(req.params.id)
    const file = req.file
    return Promise.all([User.findByPk(id), localFileHandler(file)])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist")
        if (user.id !== userId) throw new Error('無法更改他人資料')
        return user.update({ name, image: filePath || user.image })
      })
      .then(user => {
        cb(null, user)
      })
      .catch(err => cb(err))
  },
  addFavorite: (req, cb) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')

        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(favorite => {
        cb(null, favorite)
      })
      .catch(err => cb(err))
  },
  removeFavorite: (req, cb) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")

        return favorite.destroy()
      })
      .then(favorite => {
        cb(null, favorite)
      })
      .catch(err => cb(err))
  },
  addLike: (req, cb) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    return Promise.all([
      Restaurant.findByPk(restaurantId, { raw: true }),
      Like.findOne({ where: { userId, restaurantId }, raw: true })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (like) throw new Error('You haved liked this restaurant!')
        return Like.create({ restaurantId, userId })
      })
      .then(like => cb(null, like))
      .catch(err => cb(err))
  },
  removeLike: (req, cb) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    return Like.findOne({ where: { userId, restaurantId } })
      .then(like => {
        if (!like) throw new Error("You haven't liked this restaurant!")
        return like.destroy()
      })
      .then(like => cb(null, like))
      .catch(err => cb(err))
  },
  getTopUsers: (req, cb) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
        users = users.sort((a, b) => b.followerCount - a.followerCount)
        cb(null, { users })
      })
      .catch(err => cb(err))
  },
  addFollowing: (req, cb) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followingId: userId,
          followerId: req.user.id
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followingId: userId,
          followerId: req.user.id
        })
      })
      .then(followship => cb(null, followship))
      .catch(err => cb(err))
  },
  removeFollowing: (req, cb) => {
    const { userId } = req.params
    return Followship.findOne({
      followingId: userId,
      followerId: req.user.id
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(followship => cb(null, followship))
      .catch(err => cb(err))
  },
  getFollowing: (req, cb) => {
    const userId = req.user.id
    return Promise.all([
      Followship.findAll({
        where: { followingId: userId },
        raw: true
      }),
      Followship.findAll({
        where: { followerId: userId },
        raw: true
      })
    ])
      .then(([followers, followings]) => cb(null, { followers, followings }))
      .catch(err => cb(err))
  }
}

module.exports = userServices
