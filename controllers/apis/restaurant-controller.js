const restaurantServices = require('../../services/restaurant-services')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  getTopRestaurants: (req, res, next) => {
    restaurantServices.getTopRestaurants(req, (err, restaurants) =>
      err ? next(err) : res.json({ status: 'success', restaurants })
    )
  },
  getDashboard: (req, res, next) => {
    restaurantServices.getDashboard(req, (err, restaurant) =>
      err ? next(err) : res.json({ status: 'success', restaurant })
    )
  },
  getFeeds: (req, res, next) => {
    restaurantServices.getFeeds(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  }
}

module.exports = restaurantController
