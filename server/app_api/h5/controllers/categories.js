const mongoose = require('mongoose')
const Category = mongoose.model('Category')

const sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

module.exports.categoryList = function (req, res) {
  Category.find({'parentId': ''})
    .select("category_id name")
    .exec(function (err, results) {
      if (err) {
        sendJsonResponse(res, 404, err)
      }
      sendJsonResponse(res, 200, results)
    })
}