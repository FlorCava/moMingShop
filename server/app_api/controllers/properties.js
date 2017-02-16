const mongoose = require('mongoose')
const Property = mongoose.model('Property')
const config = require('../config/config')
const validator = require('validator')

const sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

function validatePropertyForm (payload) {
  const errors = {}
  let isFormValid = true

  if (!payload || validator.isEmpty(payload.name)) {
    isFormValid = false;
    errors.name = '请填写【属性名称】。'
  }

  if (!isFormValid) {
    errors.summary = '请检查表单字段中的错误。'
  }

  return {
    success: isFormValid,
    errors
  }
}

module.exports.propertyList = function (req, res) {
  let page = Math.max(0, req.params.page)
  let query = {};
  let options = {
    sort: {name: 'asc'},
    page: page,
    limit: config.perPage
  }

  Property.paginate(query, options, function (err, result) {
    if (err) {
      return sendJsonResponse(res, 404, err);
    }
    sendJsonResponse(res, 200, {
      properties: result.docs,
      page: page,
      pages: result.pages
    })
  })
}

module.exports.propertyReadOne = function (req, res) {
  if (req.params && req.params.propertyId) {
    Property.findById(req.params.propertyId)
      .exec(function (err, property) {
        if (err) {
          sendJsonResponse(res, 404, err);
        } else {
          sendJsonResponse(res, 200, property);
        }
      })
  }
}

module.exports.propertyCreate = function (req, res) {
  const validationResult = validatePropertyForm(req.body)
  if (!validationResult.success) {
    return sendJsonResponse(res, 400, {
      success: false,
      errors: validationResult.errors
    })
  }

  if (req.body && req.body.name) {
    Property.create({
      name: req.body.name,
      categoryId: req.body.categoryId,
      sort_order: req.body.sort_order,
      description: req.body.description,
      options: req.body.options
    }, function (err, property) {
      if (err) {
        sendJsonResponse(res, 404, err);
      } else {
        sendJsonResponse(res, 201, property);
      }
    })
  }
}

module.exports.propertyUpdateOne = function (req, res) {
  if (!req.params.propertyId) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要更新的商品属性"
    })
  }
  const validationResult = validatePropertyForm(req.body)
  if (!validationResult.success) {
    return sendJsonResponse(res, 400, {
      success: false,
      errors: validationResult.errors
    })
  }
  if (req.body && req.body.name) {
    Property.findById(req.params.propertyId)
      .exec(function (err, property) {
        if (!property) {
          return sendJsonResponse(res, 404, {
            "message": "没有找到需要更新的商品属性"
          });
        } else if (err) {
          return sendJsonResponse(res, 400, err)
        }
        property.name = req.body.name
        property.categoryId = req.body.categoryId
        property.sort_order = req.body.sort_order
        property.description = req.body.description
        property.options = req.body.options
        property.save(function (err, property) {
          if (err) {
            sendJsonResponse(res, 404, err)
          } else {
            sendJsonResponse(res, 200, property)
          }
        })
      })
  }
}

module.exports.propertyDeleteOne = function (req, res) {
  if (!req.params.propertyId) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要删除的商品属性"
    })
  }
  Property.findByIdAndRemove(req.params.propertyId)
    .exec(function (err) {
      if (err) {
        sendJsonResponse(res, 404, err);
      } else {
        sendJsonResponse(res, 204, {
          "message": "删除成功"
        })
      }
    })
}