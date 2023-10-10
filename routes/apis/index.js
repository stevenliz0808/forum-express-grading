const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const restaurantController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const commentController = require('../../controllers/apis/comment-controller')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
const upload = require('../../middleware/multer')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.post('/signup', userController.signUp)
router.post(
  '/signin',
  passport.authenticate('local', { session: false }),
  userController.signIn
)
router.get(
  '/restaurants/:id/dashboard',
  authenticated,
  restaurantController.getDashboard
)

router.get(
  '/restaurants/top',
  authenticated,
  restaurantController.getTopRestaurants
)

router.get('/restaurants/feeds', authenticated, restaurantController.getFeeds)

router.get(
  '/restaurants/:id',
  authenticated,
  restaurantController.getRestaurant
)

router.get('/restaurants', authenticated, restaurantController.getRestaurants)

router.post('/comments', authenticated, commentController.postComment)

router.delete('/comments/:id', authenticated, commentController.deleteComment)

router.post(
  '/favorite/:restaurantId',
  authenticated,
  userController.addFavorite
)

router.delete(
  '/favorite/:restaurantId',
  authenticated,
  userController.removeFavorite
)

router.post('/like/:restaurantId', authenticated, userController.addLike)

router.delete('/like/:restaurantId', authenticated, userController.removeLike)

router.get('/users/top', authenticated, userController.getTopUsers)

router.get('/users/:id', authenticated, userController.getUser)

router.put(
  '/users/:id',
  upload.single('image'),
  authenticated,
  userController.putUser
)

router.get('/following/:userId', authenticated, userController.getFollowing)

router.post('/following/:userId', authenticated, userController.addFollowing)

router.delete(
  '/following/:userId',
  authenticated,
  userController.removeFollowing
)
router.use('/', apiErrorHandler)

module.exports = router
