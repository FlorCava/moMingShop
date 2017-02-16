const mongoose = require('mongoose')
const File = mongoose.model('File')

const fs = require('fs')

const sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

module.exports.fileCreate = function (req, res) {
  if (req.file) {
    let name = ''
    if (req.body.fileName !== undefined) {
      name = req.body.fileName
    }
    let path = req.file.path
    // 所有文件都保存在public目录下面
    let url = path.substring(path.indexOf('/public/') + 7)
    File.create({
      name: name,
      size: req.file.size,
      type: req.file.mimetype,
      path: path,
      url: url
    }, function (err, file) {
      if (err) {
        sendJsonResponse(res, 400, err)
      } else {
        sendJsonResponse(res, 201, file)
      }
    })
  }
}

module.exports.fileDeleteOne = function (req, res) {
  if (!req.params[0]) {
    sendJsonResponse(res, 404, {
      "message": "没有找到需要删除的文件"
    })
  }
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