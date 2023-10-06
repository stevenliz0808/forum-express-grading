const { Restaurant, Category } = require('../models')
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
  }
}

module.exports = adminServices
