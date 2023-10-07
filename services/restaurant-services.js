const { Restaurant, Category } = require('../models')
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
  }
}

module.exports = restaurantServices