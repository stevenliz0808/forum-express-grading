const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')

const { User, Restaurant } = require('../models')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User.findOne({ where: { email } })
        .then(user => {
          if (!user) return done(null, false, req.flash('error', '帳號或密碼錯誤!'))
          bcrypt.compare(password, user.password)
            .then(isMatch => {
              if (!isMatch) {
                return done(null, false, req.flash('error', '帳號或密碼錯誤!'))
              }

              return done(null, user)
            })
        })
        .catch(err => done(err))
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => done(null, user.toJSON()))
    .catch(err => done(err))
})
module.exports = passport
