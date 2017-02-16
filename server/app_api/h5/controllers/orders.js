const mongoose = require('mongoose')
const Order = mongoose.model('Order')
const validator = require('validator')
const config = require('../../config/config')

const sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

function validateOrderForm (payload) {
  const errors = {}
  let isFormValid = true

  if (!payload || payload.total_qty == 0) {
    isFormValid = false
    errors.total_qty = '订单中没有商品'
  }
  if (!payload || validator.isEmpty(payload.address)) {
    isFormValid = false
    errors.address = '请设置【收获地址】'
  }

  if (!isFormValid) {
    errors.summary = '请检查表单字段中的错误。'
  }

  return {
    success: isFormValid,
    errors
  }
}

module.exports.orderList = function (req, res) {
  const status = req.query.status
  let query = {}
  if (status) {
    query = {
      status: status
    }
  }
  Order.find(query)
    .exec(function (err, results) {
      if (err) {
        sendJsonResponse(res, 404, err)
      }
      sendJsonResponse(res, 200, results)
    })
}

module.exports.orderCreateOne = function (req, res) {
  const validationResult = validateOrderForm(req.body)
  if (!validationResult.success) {
    return sendJsonResponse(res, 400, {
      success: false,
      errors: validationResult.errors
    })
  }

  if (req.body) {
    Order.create({
      total_amount: req.body.total_amount,
      discount_amount: req.body.discount_amount,
      paid_amount: req.body.paid_amount,
      items: req.body.items,
      is_need_pay: req.body.is_need_pay,
      total_qty: req.body.total_qty,
      order_description: req.body.order_description,
      address: req.body.address
    }, function (err, order) {
      if (err) {
        sendJsonResponse(res, 400, err)
      } else {
        sendJsonResponse(res, 201, order)
      }
    })
  }
}