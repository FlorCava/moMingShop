const mongoose = require('mongoose')
const Slide = mongoose.model('Slide')

const sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

module.exports.homeSlideList = function (req, res) {
  Slide.find({
    type: 'home'
  })
    .exec(function (err, results) {
      if (err) {
        sendJsonResponse(res, 404, err)
      }
      sendJsonResponse(res, 200, results)
    })
}


