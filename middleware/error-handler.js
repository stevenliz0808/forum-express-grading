module.exports = {
  errorHandler (err, req, res, next) {
    if (err instanceof Error) {
      req.flash('error', `${err.name}: ${err.message}`)
    } else {
      req.flash('error', `${err}`)
    }
    res.redirect('back')
    next(err)
  },
  apiErrorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: `${err}`
      })
    }
    next(err)
  }
}
