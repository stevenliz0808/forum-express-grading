const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const restaurantController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const admin = require('./modules/admin')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', admin)
router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  userController.signIn
)
router.get('/restaurants', restaurantController.getRestaurants)
router.use('/', apiErrorHandler)

module.exports = router
