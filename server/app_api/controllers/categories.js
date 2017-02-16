const mongoose = require('mongoose')
const Category = mongoose.model('Category')
const config = require('../config/config')
const validator = require('validator')

const sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

function validateCategoryForm (payload) {
  const errors = {}
  let isFormValid = true

  if (!payload || validator.isEmpty(payload.name)) {
    isFormValid = false
    errors.name = '请填写【分类名称】。'
  }

  if (!isFormValid) {
    errors.summary = '请检查表单字段中的错误。'
  }

  return {
    success: isFormValid,
    errors
  }
}

module.exports.categoryList = function (req, res) {
  let page = Math.max(0, req.params.page)
  let query = {}
  let options = {
    sort: {name: 'asc'},
    page: page,
    limit: config.perPage
  }

  Category.paginate(query, options, function (err, result) {
    if (err) {
      return sendJsonResponse(res, 404, err)
    }
    sendJsonResponse(res, 200, {
      categories: result.docs,
      page: page,
      pages: result.pages
    })
  })
}

module.exports.categoryParentList = function (req, res) {
  Category.find({'parentId': ''})
    .exec(function (err, results) {
      if (err) {
        sendJsonResponse(res, 404, err)
      }
      sendJsonResponse(res, 200, results)
    })
}

module.exports.categoryReadOne = function (req, res) {
  if (req.params && req.params.categoryId) {
    Category.findById(req.params.categoryId)
      .exec(function (err, category) {
        if (err) {
          sendJsonResponse(res, 404, err)
        } else {
          sendJsonResponse(res, 200, category)
        }
      })
  }
}

module.exports.categoryCreate = function (req, res) {
  const validationResult = validateCategoryForm(req.body);
  if (!validationResult.success) {
    return sendJsonResponse(res, 400, {
      success: false,
      errors: validationResult.errors
    })
  }

  if (req.body && req.body.name) {
    Category.create({
      name: req.body.name,
      parentId: req.body.parentId,
      sort_order: req.body.sort_order,
      description: req.body.description
    }, function (err, category) {
      if (err) {
        sendJsonResponse(res, 400, err)
      } else {
        sendJsonResponse(res, 201, category)
      }
    })
  }
}

module.exports.categoryUpdateOne = function (req, res) {
  if (!req.params.categoryId) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要更新的产品分类"
    })
  }
  const validationResult = validateCategoryForm(req.body)
  if (!validationResult.success) {
    return sendJsonResponse(res, 400, {
      success: false,
      errors: validationResult.errors
    })
  }
  if (req.body && req.body.name) {
    Category.findById(req.params.categoryId)
      .exec(function (err, category) {
        if (!category) {
          return sendJsonResponse(res, 404, {
            "message": "没有找到需要更新的产品分类"
          })
        } else if (err) {
          return sendJsonResponse(res, 400, err)
        }
        category.name = req.body.name
        category.parentId = req.body.parentId
        category.sort_order = req.body.sort_order
        category.description = req.body.description
        category.save(function (err, category) {
          if (err) {
            sendJsonResponse(res, 404, err)
          } else {
            sendJsonResponse(res, 200, category)
          }
        })
      })
  }
}

module.exports.categoryDeleteOne = function (req, res) {
  if (!req.params.categoryId) {
    return sendJsonResponse(res, 404, {
      "message": "没有找到需要删除的产品分类"
    })
  }
  Category.findByIdAndRemove(req.params.categoryId)
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