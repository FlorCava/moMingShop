const request = require('request')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const wxBizDataCrypt = require('../../utils/wxBizDataCrypt')
const mongoose = require('mongoose')
const User = mongoose.model('User')

const sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

module.exports.UserInfo = function (req, res) {
  var appId = config.wxAppId
  var appSecret = config.wxAppSecret
  var encryptedData = req.body.encryptedData
  var code = req.body.code
  var iv = req.body.iv
  var sessionKey = ''
  var requestOptions, path
  path = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
  requestOptions = {
    url: path,
    method: "GET",
    json: {}
  }
  request(
    requestOptions,
    function (err, response, body) {
      if (response.statusCode === 200) {
        sessionKey = body.session_key
        var pc = new wxBizDataCrypt(appId, sessionKey)

        var data = pc.decryptData(encryptedData, iv)
        sendJsonResponse(res, 200, data)
      }
    }
  )
}

module.exports.SignUp = function (req, res) {
  if (!req.body.name || !req.body.password) {
    sendJsonResponse(res, 404, {
      success: false,
      msg: 'Please pass name and password.'
    })
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    })
  }
  // save the user
  newUser.save(function (err) {
    if (err) {
      sendJsonResponse(res, 404, {
        success: false,
        msg: 'Username already exist.'
      })
    }
    sendJsonResponse(res, 201, {
      success: true,
      msg: 'Successful created new user.'
    })
  })
}

module.exports.Authenticate = function (req, res) {
  User.findOne({
    name: req.body.name
  }, function (err, user) {
    if (err) {
      throw err
    }
    if (!user) {
      sendJsonResponse(res, 400, {
        success: false,
        msg: 'Authentication failed. User not found.'
      })
    } else {
      // check if password matches.
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          const token = jwt.sign(user, config.secret, {
            expiresIn: 60 * 60 * 24 // expires in 24 hours
          })
          sendJsonResponse(res, 200, {
            success: true,
            token: 'JWT ' + token
          })
        } else {
          sendJsonResponse(res, 400, {
            success: false,
            msg: 'Authentication failed. Wrong password.'
          })
        }
      })
    }
  })
}

module.exports.MemberInfo = function (req, res) {
  sendJsonResponse(res, 200, {
    success: true,
    msg: 'Welcome in the member area ' + req.user.name + '!'
  })
}