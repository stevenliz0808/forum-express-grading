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
  }
}

module.exports = adminServices
