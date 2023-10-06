const { Restaurant, Category } = require('../models')

const adminServices = {
  getRestaurants: (req, cb) => {
    Restaurant.findAll({
      include: [Category],
      nest: true,
      raw: true
    })
      .then(restaurants => cb(null, { restaurants }))
      .catch(err => cb(err))
  },
  deleteRestaurants: (req, cb) => {
    const id = req.params.id
    return Restaurant.findByPk(id)
      .then(restaurant => {
        if (!restaurant) {
          const err = new Error("Restaurant didn't exist!")
          err.status = 404
          throw err
        }
        return restaurant.destroy()
      })
      .then(deletedRestaurant => {
        cb(null, { restaurant: deletedRestaurant })
      })
      .catch(err => cb(err))
  }
}

module.exports = adminServices
