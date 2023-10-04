const bcrypt = require('bcrypt')
const { Restaurant, Comment, User, Favorite, Like, Followship } = require('../models')
const { localFileHandler } = require('../helpers/file-helper')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
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
      .then(() => {
        req.flash('success', '註冊成功')
        res.redirect('/signin')
      })
      .catch(error => next(error))
  },

  signInPage: (req, res) => {
    res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success', '登入成功')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.logout(() => {
      req.flash('success', '登出成功')
      res.redirect('/signin')
    })
  },
  getUser: (req, res, next) => {
    const id = req.params.id
    // const userId = req.user.id;
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
        return res.render('users/profile', { user: user.toJSON(), comment })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    const id = Number(req.params.id)
    // const userId = req.user.id;
    return User.findByPk(id, { raw: true }).then(user => {
      if (!user) throw new Error("User didn't exist")
      // if (user.id !== userId) throw new Error("無法更改他人資料");
      return res.render('users/edit', { user })
    })
  },
  putUser: (req, res, next) => {
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
      .then(() => {
        req.flash('success', '使用者資料編輯成功')
        res.redirect(`/users/${id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
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
      .then(() => {
        req.flash('success', 'Add successfully')
        res.redirect('back')
      })
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
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
      .then(() => {
        req.flash('success', 'Remove successfully')
        res.redirect('back')
      })
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
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
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const { restaurantId } = req.params
    const userId = req.user.id
    return Like.findOne({ where: { userId, restaurantId } })
      .then(like => {
        if (!like) throw new Error("You haven't liked this restaurant!")
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
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
        res.render('top-users', { users })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
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
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const { userId } = req.params
    return Followship.findOne({
      followingId: userId,
      followerId: req.user.id
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
