const categoryServices = require('../../services/category-services')

const categoryController = {
  getCategories: (req, res, next) => {
    categoryServices.getCategories(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data })
    )
  },
  postCategories: (req, res, next) => {
    categoryServices.postCategories(req, (err, category) =>
      err ? next(err) : res.json({ status: 'success', category })
    )
  },
  putCategory: (req, res, next) => {
    categoryServices.putCategory(req, (err, category) =>
      err ? next(err) : res.json({ status: 'success', category })
    )
  },
  deleteCategory: (req, res, next) => {
    categoryServices.deleteCategory(req, (err, category) =>
      err ? next(err) : res.json({ status: 'success', category })
    )
  }
}
module.exports = categoryController
