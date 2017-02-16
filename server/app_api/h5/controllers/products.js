const mongoose = require('mongoose')
const Product = mongoose.model('Product')
const config = require('../../config/config')

const sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

module.exports.productList = function (req, res) {
  let products = []
  Product.find({})
    .exec(function (err, results) {
      if (err) {
        sendJsonResponse(res, 404, err)
      }
      results.forEach(function (product) {
        products.push({
          product_id: product.product_id,
          product_name: product.product_name,
          second_title: product.second_title,
          price: product.price,
          baseImage: config.static_url + product.baseImage,
        })
      })
      sendJsonResponse(res, 200, products)
    })
}

module.exports.productListByBrand = function (req, res) {
  if (req.params && req.params.brandId) {
    let products = []
    Product.find({'brandId': req.params.brandId})
      .exec(function (err, results) {
        if (err) {
          sendJsonResponse(res, 404, err)
        }
        results.forEach(function (product) {
          products.push({
            product_id: product.product_id,
            product_name: product.product_name,
            second_title: product.second_title,
            price: product.price,
            baseImage: config.static_url + product.baseImage,
          })
        })
        sendJsonResponse(res, 200, products)
      })
  }
}

module.exports.productListByCategory = function (req, res) {
  if (req.params && req.params.categoryId) {
    let products = []
    Product.find({'categoryId': req.params.categoryId})
      .exec(function (err, results) {
        if (err) {
          sendJsonResponse(res, 404, err)
        }
        results.forEach(function (product) {
          products.push({
            product_id: product.product_id,
            product_name: product.product_name,
            second_title: product.second_title,
            price: product.price,
            baseImage: config.static_url + product.baseImage,
          })
        })
        sendJsonResponse(res, 200, products)
      })
  }
}

module.exports.productReadOne = function (req, res) {
  if (req.params && req.params.productId) {
    Product.findOne({"product_id": req.params.productId})
      .exec(function (err, product) {
        if (err) {
          sendJsonResponse(res, 404, err)
        } else {
          product.images.forEach(function (image, imageIndex) {
            product.images[imageIndex] = config.static_url + product.images[imageIndex]
          })
          sendJsonResponse(res, 200, product)
        }
      })
  }
}

