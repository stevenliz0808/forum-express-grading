const express = require('express')
const router = express.Router()
const passport = require('passport')

const admin = require('./modules/admin')

const restaurantController = require('../../controllers/pages/restaurant-controller')
const userController = require('../../controllers/pages/user-controller')
const commentController = require('../../controllers/pages/comment-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth-handler')
const { errorHandler } = require('../../middleware/error-handler')
const upload = require('../../middleware/multer')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)

router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)

router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureMessage: true
  }),
  userController.signIn
)

router.get('/logout', userController.logout)

router.get(
  '/restaurants/:id/dashboard',
  authenticated,
  restaurantController.getDashboard
)

router.get('/restaurants/top', authenticated, restaurantController.getTopRestaurants)

router.get('/restaurants/feeds', authenticated, restaurantController.getFeeds)

router.get('/restaurants/:id', authenticated, restaurantController.getRestaurant)

router.get('/restaurants', authenticated, restaurantController.getRestaurants)

router.post('/comments', authenticated, commentController.postComment)

router.delete('/comments/:id', authenticated, commentController.deleteComment)

router.post('/favorite/:restaurantId',
  authenticated,
  userController.addFavorite
)

router.delete('/favorite/:restaurantId',
  authenticated,
  userController.removeFavorite
)

router.post('/like/:restaurantId', authenticated, userController.addLike)

router.delete('/like/:restaurantId', authenticated, userController.removeLike)

router.get('/users/top', authenticated, userController.getTopUsers)

router.get('/users/:id/edit', authenticated, userController.editUser)

router.get('/users/:id', authenticated, userController.getUser)

router.put('/users/:id', upload.single('image'), authenticated, userController.putUser)

router.post('/following/:userId', authenticated, userController.addFollowing)

router.delete(
  '/following/:userId',
  authenticated,
  userController.removeFollowing
)

router.get('/', (req, res) => res.redirect('/restaurants'))

router.use('/', errorHandler)

module.exports = router
