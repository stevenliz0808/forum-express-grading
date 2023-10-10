const { Restaurant, Category, User } = require('../models')
const { localFileHandler } = require('../helpers/file-helper')

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
  postRestaurant: (req, cb) => {
    const { name, categoryId, tel, address, openingHours, description } =
      req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req
    localFileHandler(file)
      .then(filePath =>
        Restaurant.create({
          name,
          categoryId,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null
        })
      )
      .then(newRestaurant => cb(null, { restaurant: newRestaurant }))
      .catch(err => cb(err))
  },
  deleteRestaurant: (req, cb) => {
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
  },
  getRestaurant: (req, cb) => {
    const id = req.params.id
    Restaurant.findByPk(id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        cb(null, { restaurant })
      })
      .catch(err => cb(err))
  },
  putRestaurant: (req, cb) => {
    const { name, categoryId, tel, address, openingHours, description } =
      req.body
    const id = req.params.id
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req
    Promise.all([Restaurant.findByPk(id), localFileHandler(file)])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          name,
          categoryId,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image
        })
      })
      .then(restaurant => {
        cb(null, restaurant)
      })
      .catch(err => cb(err))
  },
  getUsers: (req, cb) => {
    return User.findAll({
      raw: true
    })
      .then(users => {
        cb(null, { users })
      })
      .catch(err => cb(err))
  },
  patchUser: (req, cb) => {
    const id = req.params.id
    return User.findByPk(id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        if (user.email === 'root@example.com') throw new Error('禁止變更 root 權限')
        return user.update({ isAdmin: user.isAdmin ? 0 : 1 })
      })
      .then(user => {
        return cb(null, user)
      })
      .catch(err => cb(err))
  }
}

module.exports = adminServices
