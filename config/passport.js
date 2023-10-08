const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcrypt')

const { User, Restaurant } = require('../models')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

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

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, (jwtPlayload, cb) => {
  return User.findByPk(jwtPlayload.id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => cb(null, user))
    .catch(err => cb(err))
}))

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
