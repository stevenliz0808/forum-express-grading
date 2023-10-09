const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const restaurantController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.post('/signup', userController.signUp)
router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  userController.signIn
)
router.get('/restaurants', authenticated, restaurantController.getRestaurants)
router.use('/', apiErrorHandler)

module.exports = router
