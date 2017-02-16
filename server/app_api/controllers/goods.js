const mongoose = require('mongoose')
const Goods = mongoose.model('Goods')
const config = require('../config/config')
const validator = require('validator')

const sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

function validateGoodsForm (payload) {
  const errors = {}
  let isFormValid = true

  if (!payload || validator.isEmpty(payload.name)) {
    isFormValid = false
    errors.name = '请填写【货品名称】。'
  }

  if (!isFormValid) {
    errors.summary = '请检查表单字段中的错误。'
  }

  return {
    success: isFormValid,
    errors
  }
}

module.exports.goodsList = function (req, res) {
  var page = Math.max(0, req.params.page)
  var query = {}
  var options = {
    sort: {name: 'asc'},
    page: page,
    limit: config.perPage
  }

  Goods.paginate(query, options, function (err, result) {
    if (err) {
      return sendJsonResponse(res, 404, err)
    }
    sendJsonResponse(res, 200, {
      goods: result.docs,
      page: page,
      pages: result.pages
    })
  })
}

module.exports.goodsReadOne = function (req, res) {
  if (req.params && req.params.goodsId) {
    Goods.findById(req.params.goodsId)
      .exec(function (err, goods) {
        if (err) {
          sendJsonResponse(res, 404, err)
        } else {
          sendJsonResponse(res, 200, goods)
        }
      })
  }
}

module.exports.goodsCreate = function (req, res) {
  const validationResult = validateGoodsForm(req.body)
  if (!validationResult.success) {
    return sendJsonResponse(res, 400, {
      success: false,
      errors: validationResult.errors
    })
  }

  if (req.body && req.body.name) {
    Goods.create({
      name: req.body.name,
      description: req.body.description
    }, function (err, goods) {
      if (err) {
        sendJsonResponse(res, 404, err)
      } else {
        sendJsonResponse(res, 201, goods)
      }
    })
  }
}

module.exports.goodsUpdateOne = function (req, res) {
  if (!req.params.goodsId) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要更新的货品"
    })
  }
  const validationResult = validateGoodsForm(req.body)
  if (!validationResult.success) {
    return sendJsonResponse(res, 400, {
      success: false,
      errors: validationResult.errors
    })
  }
  if (req.body && req.body.name) {
    Goods.findById(req.params.goodsId)
      .exec(function (err, goods) {
        if (!goods) {
          return sendJsonResponse(res, 404, {
            "message": "没有找到需要更新的货品"
          })
        } else if (err) {
          return sendJsonResponse(res, 400, err)
        }
        goods.name = req.body.name
        goods.description = req.body.description
        goods.save(function (err, goods) {
          if (err) {
            sendJsonResponse(res, 404, err)
          } else {
            sendJsonResponse(res, 200, goods)
          }
        })
      })
  }
}

module.exports.goodsDeleteOne = function (req, res) {
  if (!req.params.goodsId) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要删除的货品"
    })
  }
  Goods.findByIdAndRemove(req.params.goodsId)
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