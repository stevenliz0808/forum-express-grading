const { Category } = require('../models')
const categoryController = {
  getCategories: (req, cb) => {
    const id = req.params.id
    return Promise.all([
      Category.findAll({
        raw: true
      }),
      id ? Category.findByPk(id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        cb(null, { categories, category })
      })
      .catch(err => cb(err))
  },
  postCategories: (req, cb) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(category => cb(null, category))
      .catch(err => cb(err))
  },
  putCategory: (req, cb) => {
    const { name } = req.body
    const id = req.params.id
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.update({ name })
      })
      .then(category => cb(null, category))
      .catch(err => cb(err))
  },
  deleteCategory: (req, cb) => {
    const id = req.params.id
    return Category.findByPk(id)
      .then(category => {
        if (!category) throw new Error("Category doesn't exist!")
        return category.destroy()
      })
      .then(category => cb(null, category))
      .catch(err => cb(err))
  }
}
module.exports = categoryController
