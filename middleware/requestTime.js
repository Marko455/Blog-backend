const requestTime = function (req, res, next) {
    req.requestTime = Date.now()
    next()
  }

  export default requestTime 