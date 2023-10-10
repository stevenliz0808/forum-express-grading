const { Restaurant, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const restaurantServices = {
  getRestaurants: (req, cb) => {
    const DEFAULT_LIMIT = 9
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Restaurant.findAndCountAll({
        include: Category,
        nest: true,
        raw: true,
        where: categoryId ? { categoryId } : {},
        limit,
        offset
      }),
      Category.findAll({
        raw: true
      })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: req.user?.FavoritedRestaurants
            ? req.user.FavoritedRestaurants.some(fr => fr.id === r.id)
            : [],
          isLiked: req.user?.LikedRestaurants
            ? req.user.LikedRestaurants.some(lr => lr.id === r.id)
            : []
        }))
        return cb(null, {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => cb(err))
  },
  getRestaurant: (req, cb) => {
    const id = req.params.id
    Restaurant.increment('viewsCount', { where: { id } })
    return Restaurant.findByPk(id, {
      include: [
        Category,
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' }
      ]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        const isFavorited = restaurant.FavoritedUsers.some(
          fu => fu.id === req.user.id
        )
        const isLiked = restaurant.LikedUsers.some(
          lu => lu.id === req.user.id
        )
        return cb(null, {
          restaurant: restaurant.toJSON(),
          isFavorited,
          isLiked
        })
      })
      .catch(err => cb(err))
  },
  getTopRestaurants: (req, cb) => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurants => {
        restaurants = restaurants.map(r => ({
          ...r.toJSON(),
          description: r.description?.substring(0, 50),
          favoritedCount: r.FavoritedUsers.length,
          isFavorited:
            req.user &&
            req.user.FavoritedRestaurants.some(fr => fr.id === r.id)
        }))
        restaurants = restaurants
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)
        cb(null, { restaurants })
      })
      .catch(err => cb(err))
  },
  getDashboard: (req, cb) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      include: Category,
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return cb(null, { restaurant })
      })
      .catch(err => cb(err))
  },
  getFeeds: (req, cb) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      })
    ])
      .then(([restaurants, comments]) => {
        cb(null, { restaurants, comments })
      })
      .catch(err => cb(err))
  }
}

module.exports = restaurantServices
