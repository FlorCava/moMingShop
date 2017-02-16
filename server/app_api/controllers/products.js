const mongoose = require('mongoose')
const Product = mongoose.model('Product')
const config = require('../config/config')
const validator = require('validator')
const File = mongoose.model('File')
const Counter = mongoose.model('Counter')
const fs = require('fs')

const sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

function validateProductStepOneForm (payload) {
  const errors = {}
  let isFormValid = true

  if (!payload || validator.isEmpty(payload.brandId)) {
    isFormValid = false
    errors.brandId = '请选择【所属品牌】。'
  }
  if (!payload || validator.isEmpty(payload.categoryId)) {
    isFormValid = false
    errors.categoryId = '请选择【所属分类】。'
  }

  if (!isFormValid) {
    errors.summary = '请检查表单字段中的错误。'
  }

  return {
    success: isFormValid,
    errors
  }
}

function validateProductStepTwoForm (payload) {
  const errors = {}
  let isFormValid = true

  if (!payload || validator.isEmpty(payload.product_name)) {
    isFormValid = false
    errors.product_name = '请填写【产品名称】。'
  }
  if (!payload || !validator.isCurrency(payload.price + '', {allow_negatives: false})) {
    isFormValid = false
    errors.price = '请填写正确的【产品价格】。'
  }

  if (!isFormValid) {
    errors.summary = '请检查表单字段中的错误。'
  }

  return {
    success: isFormValid,
    errors
  }
}

module.exports.productList = function (req, res) {
  let page = Math.max(0, req.params.page)
  let query = {}
  let options = {
    sort: {name: 'asc'},
    page: page,
    limit: config.perPage
  }

  Product.paginate(query, options, function (err, result) {
    if (err) {
      return sendJsonResponse(res, 404, err)
    }
    sendJsonResponse(res, 200, {
      products: result.docs,
      page: page,
      pages: result.pages
    })
  })
}

module.exports.productReadOne = function (req, res) {
  if (req.params && req.params.productId) {
    Product.findById(req.params.productId)
      .exec(function (err, product) {
        if (err) {
          sendJsonResponse(res, 404, err)
        } else {
          sendJsonResponse(res, 200, product)
        }
      })
  }
}

module.exports.productCreateStepOne = function (req, res) {
  const validationResult = validateProductStepOneForm(req.body)
  if (!validationResult.success) {
    return sendJsonResponse(res, 400, {
      success: false,
      errors: validationResult.errors
    })
  }

  if (req.body) {
    Product.create({
      brandId: req.body.brandId,
      brandName: req.body.brandName,
      // goodsId: req.body.goodsId,
      // goodsName: req.body.goodsName,
      categoryId: req.body.categoryId,
      categoryName: req.body.categoryName,
      // sku: req.body.sku,
    }, function (err, product) {
      if (err) {
        sendJsonResponse(res, 400, err)
      } else {
        sendJsonResponse(res, 201, product)
      }
    })
  }
}

module.exports.productUpdateStepOne = function (req, res) {
  if (!req.params.productId) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要更新的产品"
    })
  }
  const validationResult = validateProductStepOneForm(req.body)
  if (!validationResult.success) {
    return sendJsonResponse(res, 400, {
      success: false,
      errors: validationResult.errors
    })
  }
  if (req.body) {
    Product.findById(req.params.productId)
      .exec(function (err, product) {
        if (!product) {
          return sendJsonResponse(res, 404, {
            "message": "没有找到需要更新的产品"
          })
        } else if (err) {
          return sendJsonResponse(res, 400, err)
        }
        product.brandId = req.body.brandId
        product.brandName = req.body.brandName
        product.goodsId = req.body.goodsId
        product.goodsName = req.body.goodsName
        product.categoryId = req.body.categoryId
        product.categoryName = req.body.categoryName
        product.save(function (err, product) {
          if (err) {
            sendJsonResponse(res, 404, err)
          } else {
            sendJsonResponse(res, 200, product)
          }
        })
      })
  }
}

module.exports.productUpdateStepTwo = function (req, res) {
  if (!req.params.productId) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要更新的产品"
    })
  }
  const validationResult = validateProductStepTwoForm(req.body)
  if (!validationResult.success) {
    return sendJsonResponse(res, 400, {
      success: false,
      errors: validationResult.errors
    })
  }
  if (req.body) {
    Product.findById(req.params.productId)
      .exec(function (err, product) {
        if (!product) {
          return sendJsonResponse(res, 404, {
            "message": "没有找到需要更新的产品"
          })
        } else if (err) {
          return sendJsonResponse(res, 400, err)
        }
        product.product_name = req.body.product_name
        product.second_title = req.body.second_title
        product.is_saleable = req.body.is_saleable
        product.price = req.body.price
        product.options = req.body.options
        product.save(function (err, product) {
          if (err) {
            sendJsonResponse(res, 404, err)
          } else {
            sendJsonResponse(res, 200, product)
          }
        })
      })
  }
}

module.exports.productUpdateStepThree = function (req, res) {
  if (!req.params.productId) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要更新的产品"
    })
  }
  if (req.body) {
    Product.findById(req.params.productId)
      .exec(function (err, product) {
        if (!product) {
          return sendJsonResponse(res, 404, {
            "message": "没有找到需要更新的产品"
          })
        } else if (err) {
          return sendJsonResponse(res, 400, err)
        }
        product.product_specification = req.body.product_specification
        product.sales_support = req.body.sales_support
        product.description = req.body.description
        product.description_draft = req.body.description_draft
        product.save(function (err, product) {
          if (err) {
            sendJsonResponse(res, 404, err)
          } else {
            sendJsonResponse(res, 200, product)
          }
        })
      })
  }
}

module.exports.productCreate = function (req, res) {
  if (req.body) {
    Product.create({
      product_name: req.body.product_name,
      second_title: req.body.second_title,
      product_specification: req.body.product_specification,
      sales_support: req.body.sales_support,
      description: req.body.description,
      description_draft: req.body.description_draft,
      // brand: req.body.brand,
      brandId: req.body.brandId,
      brandName: req.body.brandName,
      goodsId: req.body.goodsId,
      goodsName: req.body.goodsName,
      categoryId: req.body.categoryId,
      categoryName: req.body.categoryName,
      baseImage: req.body.baseImage,
      thumbnail: req.body.thumbnail,
      images: req.body.images,
      is_saleable: req.body.is_saleable,
      price: req.body.price,
      sku: req.body.sku,
      status: req.body.status,
      options: req.body.options
    }, function (err, product) {
      if (err) {
        sendJsonResponse(res, 400, err.message)
      } else {
        sendJsonResponse(res, 201, product)
      }
    })
  }
}

module.exports.productUpdateOne = function (req, res) {
  if (!req.params.productId) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要更新的产品"
    })
  }
  if (req.body) {
    Product.findById(req.params.productId)
      .exec(function (err, product) {
        if (!product) {
          return sendJsonResponse(res, 404, {
            "message": "没有找到需要更新的产品"
          })
        } else if (err) {
          return sendJsonResponse(res, 400, err)
        }
        product.product_name = req.body.product_name
        product.second_title = req.body.second_title
        product.product_specification = req.body.product_specification
        product.sales_support = req.body.sales_support
        product.description = req.body.description
        product.description_draft = req.body.description_draft
        // product.brand = req.body.brand
        product.brandId = req.body.brandId
        product.brandName = req.body.brandName
        product.goodsId = req.body.goodsId
        product.goodsName = req.body.goodsName
        product.categoryId = req.body.categoryId
        product.categoryName = req.body.categoryName
        product.images = req.body.images
        product.is_saleable = req.body.is_saleable
        product.price = req.body.price
        product.sku = req.body.sku
        product.status = req.body.status
        product.options = req.body.options
        product.save(function (err, product) {
          if (err) {
            sendJsonResponse(res, 404, err)
          } else {
            sendJsonResponse(res, 200, product)
          }
        })
      })
  }
}

module.exports.productDeleteOne = function (req, res) {
  if (!req.params.productId) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要删除的产品"
    })
  }
  Product.findByIdAndRemove(req.params.productId)
    .exec(function (err) {
      if (err) {
        return sendJsonResponse(res, 404, err)
      } else {
        return sendJsonResponse(res, 204, {
          "message": "删除成功"
        })
      }
    })
}

module.exports.productImagesAddOne = function (req, res) {
  if (!req.params.productId && !req.params[0]) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要添加的图片"
    })
  }
  Product.findById(req.params.productId)
    .exec(function (err, product) {
      if (err) {
        return sendJsonResponse(res, 404, err)
      } else {
        product.images.push(req.params[0])
        product.save(function (err, product) {
          if (err) {
            sendJsonResponse(res, 404, err)
          } else {
            sendJsonResponse(res, 200, {
              "message": "添加成功"
            })
          }
        })
      }
    })
}

module.exports.productImagesDeleteOne = function (req, res) {
  if (!req.params.productId && !req.params[0]) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要删除的图片"
    })
  }
  Product.findById(req.params.productId)
    .exec(function (err, product) {
      if (err) {
        return sendJsonResponse(res, 404, err)
      } else {
        product.images.pull(req.params[0])
        product.save(function (err, product) {
          if (err) {
            return sendJsonResponse(res, 404, err)
          } else {
            File.findOneAndRemove({'url': req.params[0]})
              .exec(function (err, file) {
                if (err) {
                  sendJsonResponse(res, 404, err)
                } else {
                  fs.unlink(file.path, function () {
                    sendJsonResponse(res, 204, {
                      "message": "删除成功"
                    })
                  })
                }
              })
          }
        })
      }
    })
}

module.exports.productBaseImageAdd = function (req, res) {
  if (!req.params.productId && !req.params[0]) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要添加的图片"
    })
  }
  Product.findById(req.params.productId)
    .exec(function (err, product) {
      if (err) {
        return sendJsonResponse(res, 404, err)
      } else {
        product.baseImage = req.params[0]
        // product.thumbnail = req.body.thumbnail

        product.save(function (err, product) {
          if (err) {
            sendJsonResponse(res, 404, err);
          } else {
            sendJsonResponse(res, 200, {
              "message": "添加成功"
            })
          }
        })
      }
    })
}

module.exports.productBaseImageDelete = function (req, res) {
  if (!req.params.productId && !req.params[0]) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要删除的图片"
    })
  }
  Product.findById(req.params.productId)
    .exec(function (err, product) {
      if (err) {
        return sendJsonResponse(res, 404, err)
      } else {
        product.baseImage = ''
        // product.thumbnail = ''
        product.save(function (err, product) {
          if (err) {
            return sendJsonResponse(res, 404, err)
          } else {
            File.findOneAndRemove({'url': req.params[0]})
              .exec(function (err, file) {
                if (err) {
                  sendJsonResponse(res, 404, err)
                } else {
                  fs.unlink(file.path, function () {
                    sendJsonResponse(res, 204, {
                      "message": "删除成功"
                    })
                  })
                }
              })
          }
        })
      }
    })
}

