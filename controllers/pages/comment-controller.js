const commentServices = require('../../services/comment-controller')

const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, comment) =>
      err ? next(err) : res.redirect(`/restaurants/${comment.restaurantId}`)
    )
  },
  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, (err, comment) =>
      err ? next(err) : res.redirect(`/restaurants/${comment.restaurantId}`)
    )
  }
}

module.exports = commentController
