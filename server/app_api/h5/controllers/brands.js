const mongoose = require('mongoose')
const Brand = mongoose.model('Brand')

const sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

module.exports.brandList = function (req, res) {
  Brand.find({})
    .select("brand_id name")
    .exec(function (err, results) {
      if (err) {
        sendJsonResponse(res, 404, err)
      }
      sendJsonResponse(res, 200, results)
    })
}