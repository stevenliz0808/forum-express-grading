const { Restaurant, Category } = require('../../models')
const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, restaurants) =>
      err ? next(err) : res.render('admin/restaurants', restaurants)
    )
  },
  createRestaurant: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => {
        res.render('admin/create-restaurant', { categories })
      })
      .catch(err => next(err))
  },
  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, restaurant) => {
      if (err) return next(err)
      req.flash('success', 'Restaurant was successfully created')
      req.session.createdData = restaurant
      return res.redirect('/admin/restaurants')
    })
  },
  getRestaurant: (req, res, next) => {
    adminServices.getRestaurant(req, (err, restaurant) => {
      err ? next(err) : res.render('admin/restaurant', restaurant)
    })
  },
  editRestaurant: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      Category.findAll({ raw: true }),
      Restaurant.findByPk(id, {
        raw: true
      })
    ])
      .then(([categories, restaurant]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },
  putRestaurant: (req, res, next) => {
    adminServices.putRestaurant(req, (err, restaurant) => {
      if (err) return next(err)
      req.flash('success', 'restaurant was successfully to update')
      return res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, restaurant) => {
      if (err) return next(err)
      return res.redirect('/admin/restaurants', restaurant)
    })
  },
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, users) => {
      err ? next(err) : res.render('admin/users', users)
    })
  },
  patchUser: (req, res, next) => {
    adminServices.patchUser(req, (err, user) => {
      if (err) return next(err)
      req.flash('success', '使用者權限變更成功')
      return res.redirect('/admin/users')
    })
  }
}

module.exports = adminController
