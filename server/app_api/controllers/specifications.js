const mongoose = require('mongoose')
const Specification = mongoose.model('Specification')
const config = require('../config/config')
const validator = require('validator')

const sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

function validateSpecificationForm (payload) {
  const errors = {}
  let isFormValid = true

  if (!payload || validator.isEmpty(payload.name)) {
    isFormValid = false;
    errors.name = '请填写【规格名称】。'
  }

  if (!isFormValid) {
    errors.summary = '请检查表单字段中的错误。'
  }

  return {
    success: isFormValid,
    errors
  }
}

module.exports.specificationList = function (req, res) {
  let page = Math.max(0, req.params.page)
  let query = {}
  let options = {
    sort: {name: 'asc'},
    page: page,
    limit: config.perPage
  }

  Specification.paginate(query, options, function (err, result) {
    if (err) {
      return sendJsonResponse(res, 404, err)
    }
    sendJsonResponse(res, 200, {
      specifications: result.docs,
      page: page,
      pages: result.pages
    })
  })
}

module.exports.specificationListWithoutPage = function (req, res) {
  Specification.find({})
    .exec(function (err, results) {
      if (err) {
        sendJsonResponse(res, 404, err)
      }
      sendJsonResponse(res, 200, results)
    })
}

module.exports.specificationReadOne = function (req, res) {
  if (req.params && req.params.specificationId) {
    Specification.findById(req.params.specificationId)
      .exec(function (err, specification) {
        if (err) {
          sendJsonResponse(res, 404, err)
        } else {
          sendJsonResponse(res, 200, specification)
        }
      })
  }
}

module.exports.specificationCreate = function (req, res) {
  const validationResult = validateSpecificationForm(req.body)
  if (!validationResult.success) {
    return sendJsonResponse(res, 400, {
      success: false,
      errors: validationResult.errors
    })
  }

  if (req.body && req.body.name) {
    Specification.create({
      name: req.body.name,
      goodsId: req.body.goodsId,
      sort_order: req.body.sort_order,
      description: req.body.description,
      options: req.body.options
    }, function (err, specification) {
      if (err) {
        sendJsonResponse(res, 404, err);
      } else {
        sendJsonResponse(res, 201, specification);
      }
    })
  }
}

module.exports.specificationUpdateOne = function (req, res) {
  if (!req.params.specificationId) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要更新的商品规格"
    })
  }
  const validationResult = validateSpecificationForm(req.body)
  if (!validationResult.success) {
    return sendJsonResponse(res, 400, {
      success: false,
      errors: validationResult.errors
    })
  }
  if (req.body && req.body.name) {
    Specification.findById(req.params.specificationId)
      .exec(function (err, specification) {
        if (!specification) {
          return sendJsonResponse(res, 404, {
            "message": "没有找到需要更新的商品规格"
          })
        } else if (err) {
          return sendJsonResponse(res, 400, err)
        }
        specification.name = req.body.name
        specification.goodsId = req.body.goodsId
        specification.sort_order = req.body.sort_order
        specification.description = req.body.description
        specification.options = req.body.options
        specification.save(function (err, specification) {
          if (err) {
            sendJsonResponse(res, 404, err)
          } else {
            sendJsonResponse(res, 200, specification)
          }
        })
      })
  }
}

module.exports.specificationDeleteOne = function (req, res) {
  if (!req.params.specificationId) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要删除的商品规格"
    })
  }
  Specification.findByIdAndRemove(req.params.specificationId)
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