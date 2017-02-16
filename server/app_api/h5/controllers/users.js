const request = require('request')
const jwt = require('jsonwebtoken')
const config = require('../../config/config')
const WxBizDataCrypt = require('../../../utils/WxBizDataCrypt')
const mongoose = require('mongoose')
const User = mongoose.model('User')

const sendJsonResponse = function (res, status, content) {
  res.status(status)
  res.json(content)
}

module.exports.userInfo = function (req, res) {
  let data = {
    openId: 'odtT50K4LkzAwmAPWYFgEqyGNeME'
  }
  let query = {}
  if (data.unionId) {
    query = {
      'weiXin.appId': config.wxAppId,
      'weiXin.unionId': data.unionId
    }
  } else if (data.openId) {
    query = {
      'weiXin.appId': config.wxAppId,
      'weiXin.openId': data.openId
    }
  }
  User.findOne(query, function (err, user) {
    return sendJsonResponse(res, 200, {
      success: true,
      user: user
    })
  })
}

module.exports.authWithWeiXinApp = function (req, res) {
  const appId = config.wxAppId
  const appSecret = config.wxAppSecret
  const encryptedData = req.body.encryptedData
  const code = req.body.code
  const iv = req.body.iv
  let sessionKey = ''
  let requestOptions, path
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
        const pc = new WxBizDataCrypt(appId, sessionKey)
        const data = pc.decryptData(encryptedData, iv)
        let query = {}
        if (data.unionId) {
          query = {
            'weiXin.unionId': data.unionId
          }
        } else if (data.openId) {
          query = {
            'weiXin.appId': config.wxAppId,
            'weiXin.openId': data.openId
          }
        }
        User.findOne(query, function (err, user) {
          if (err) {
            throw err;
          }
          if (!user) {
            var newUser = new User({
              avatarUrl: data.avatarUrl,
              name: data.nickName,
              weiXin: {
                appId: config.wxAppId,
                openId: data.openId,
                unionId: data.unionId,
                nickName: data.nickName,
                gender: data.gender,
                city: data.city,
                province: data.province,
                country: data.country,
                avatarUrl: data.avatarUrl
              }
            })
            newUser.save(function (err, savedUser) {
              if (err) {
                return sendJsonResponse(res, 400, {
                  success: false,
                  msg: err
                })
              }
              const token = jwt.sign(savedUser, config.secret, {
                expiresIn: 60 * 60 * 24 // expires in 24 hours
              })
              return sendJsonResponse(res, 201, {
                success: true,
                token: 'JWT ' + token,
                user: savedUser
              })
            })
          } else {
            var token = jwt.sign(user, config.secret, {
              expiresIn: 60 * 60 * 24 // expires in 24 hours
            })
            return sendJsonResponse(res, 200, {
              success: true,
              token: 'JWT ' + token,
              user: user
            })
          }
        })
      } else {
        return sendJsonResponse(res, 400, {
          success: false,
          msg: body.errmsg
        })
      }
    }
  )
}