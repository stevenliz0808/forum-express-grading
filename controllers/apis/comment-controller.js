const commentServices = require('../../services/comment-controller')

const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, comment) =>
      err ? next(err) : res.json({ status: 'success', comment })
    )
  },
  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, (err, comment) =>
      err ? next(err) : res.json({ status: 'success', comment })
    )
  }
}

module.exports = commentController
