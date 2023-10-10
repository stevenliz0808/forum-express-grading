const userServices = require('../../services/user-services')
const { User } = require('../../models')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },

  signUp: (req, res, next) => {
    userServices.signUp(req, (err, user) => {
      if (err) return next(err)
      req.flash('success', '註冊成功')
      return res.redirect('/signin')
    })
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
    userServices.getUser(req, (err, data) =>
      err ? next(err) : res.render('users/profile', data)
    )
  },
  editUser: (req, res, next) => {
    const id = Number(req.params.id)
    return User.findByPk(id, { raw: true }).then(user => {
      if (!user) throw new Error("User didn't exist")
      return res.render('users/edit', { user })
    })
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, (err, user) => {
      if (err) next(err)
      req.flash('success', '使用者資料編輯成功')
      res.redirect(`/users/${user.id}`)
    })
  },
  addFavorite: (req, res, next) => {
    userServices.addFavorite(req, (err, favorite) => {
      if (err) next(err)
      req.flash('success', 'Add successfully')
      res.redirect('back')
    })
  },
  removeFavorite: (req, res, next) => {
    userServices.removeFavorite(req, (err, favorite) => {
      if (err) next(err)
      req.flash('success', 'Remove successfully')
      res.redirect('back')
    })
  },
  addLike: (req, res, next) => {
    userServices.addLike(req, (err, like) =>
      err ? next(err) : res.redirect('back')
    )
  },
  removeLike: (req, res, next) => {
    userServices.removeLike(req, (err, like) =>
      err ? next(err) : res.redirect('back')
    )
  },
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, users) =>
      err ? next(err) : res.render('top-users', users)
    )
  },
  addFollowing: (req, res, next) => {
    userServices.addFollowing(req, (err, followship) =>
      err ? next(err) : res.redirect('back')
    )
  },
  removeFollowing: (req, res, next) => {
    userServices.removeFollowing(req, (err, followship) =>
      err ? next(err) : res.redirect('back')
    )
  }
}

module.exports = userController
