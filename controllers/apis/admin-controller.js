const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, restaurants) =>
      err ? next(err) : res.json({ status: 'success', restaurants })
    )
  },
  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, restaurant) =>
      err ? next(err) : res.json({ status: 'success', restaurant })
    )
  },
  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, restaurant) =>
      err ? next(err) : res.json({ status: 'success', restaurant })
    )
  },
  getRestaurant: (req, res, next) => {
    adminServices.getRestaurant(req, (err, restaurant) => {
      err ? next(err) : res.json({ status: 'success', restaurant })
    })
  },
  putRestaurant: (req, res, next) => {
    adminServices.putRestaurant(req, (err, restaurant) => {
      err ? next(err) : res.json({ status: 'success', restaurant })
    })
  },
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, users) => {
      err ? next(err) : res.json({ status: 'success', users })
    })
  },
  patchUser: (req, res, next) => {
    adminServices.patchUser(req, (err, user) => {
      err ? next(err) : res.json({ status: 'success', user })
    })
  }
}

module.exports = adminController
