const mongoose = require('mongoose')
const Brand = mongoose.model('Brand')
const config = require('../config/config')
const validator = require('validator')

const sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

function validateBrandForm (payload) {
  const errors = {}
  let isFormValid = true

  if (!payload || validator.isEmpty(payload.name)) {
    isFormValid = false
    errors.name = '请填写【品牌名称】。'
  }

  if (!isFormValid) {
    errors.summary = '请检查表单字段中的错误。'
  }

  return {
    success: isFormValid,
    errors
  }
}

module.exports.brandList = function (req, res) {
  let page = Math.max(0, req.params.page)
  let query = {}
  let options = {
    sort: {name: 'asc'},
    page: page,
    limit: config.perPage
  }

  Brand.paginate(query, options, function (err, result) {
    if (err) {
      return sendJsonResponse(res, 404, err)
    }
    sendJsonResponse(res, 200, {
      brands: result.docs,
      page: page,
      pages: result.pages
    })
  })
}

module.exports.brandReadOne = function (req, res) {
  if (req.params && req.params.brandId) {
    Brand.findById(req.params.brandId)
      .exec(function (err, brand) {
        if (err) {
          sendJsonResponse(res, 404, err)
        } else {
          sendJsonResponse(res, 200, brand)
        }
      })
  }
}

module.exports.brandCreate = function (req, res) {
  const validationResult = validateBrandForm(req.body)
  if (!validationResult.success) {
    return sendJsonResponse(res, 400, {
      success: false,
      errors: validationResult.errors
    })
  }

  if (req.body && req.body.name) {
    Brand.create({
      name: req.body.name,
      description: req.body.description
    }, function (err, brand) {
      if (err) {
        sendJsonResponse(res, 400, err)
      } else {
        sendJsonResponse(res, 201, brand)
      }
    })
  }
}

module.exports.brandUpdateOne = function (req, res) {
  if (!req.params.brandId) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要更新的产品品牌"
    })
  }
  const validationResult = validateBrandForm(req.body)
  if (!validationResult.success) {
    return sendJsonResponse(res, 400, {
      success: false,
      errors: validationResult.errors
    })
  }
  if (req.body && req.body.name) {
    Brand.findById(req.params.brandId)
      .exec(function (err, brand) {
        if (!brand) {
          return sendJsonResponse(res, 404, {
            "message": "没有找到需要更新的产品品牌"
          })
        } else if (err) {
          return sendJsonResponse(res, 400, err)
        }
        brand.name = req.body.name
        brand.description = req.body.description
        brand.save(function (err, brand) {
          if (err) {
            sendJsonResponse(res, 404, err)
          } else {
            sendJsonResponse(res, 200, brand)
          }
        })
      })
  }
}

module.exports.brandDeleteOne = function (req, res) {
  if (!req.params.brandId) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要删除的产品品牌"
    })
  }
  Brand.findByIdAndRemove(req.params.brandId)
    .exec(function (err) {
      if (err) {
        sendJsonResponse(res, 404, err)
      } else {
        sendJsonResponse(res, 204, {
          "message": "删除成功"
        })
      }
    })
}