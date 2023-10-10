const restaurantServices = require('../../services/restaurant-services')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) =>
      err ? next(err) : res.render('restaurants', data)
    )
  },
  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, data) =>
      err ? next(err) : res.render('restaurant', data)
    )
  },
  getTopRestaurants: (req, res, next) => {
    restaurantServices.getTopRestaurants(req, (err, restaurants) =>
      err ? next(err) : res.render('top-restaurants', restaurants)
    )
  },
  getDashboard: (req, res, next) => {
    restaurantServices.getDashboard(req, (err, restaurant) =>
      err ? next(err) : res.render('dashboard', restaurant)
    )
  },
  getFeeds: (req, res, next) => {
    restaurantServices.getFeeds(req, (err, data) =>
      err ? next(err) : res.render('feeds', data)
    )
  }
}

module.exports = restaurantController
