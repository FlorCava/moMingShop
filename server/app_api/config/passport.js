const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const WechatStrategy = require('passport-wechat').Strategy

const mongoose = require('mongoose')
const User = mongoose.model('User')
const config = require('../config/config')

module.exports = function (passport) {
  const opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader()
  opts.secretOrKey = config.secret
  opts.passReqToCallback = true
  passport.use('jwt', new JwtStrategy(opts, function (req, jwt_payload, done) {
    console.log(jwt_payload)
    console.log(jwt_payload.sub)
    // Todo:此处需要处理（例如使用jwt-simple）成jwt_payload.id来访问
    User.findOne({_id: jwt_payload._doc._id}, function (err, user) {
      if (err) {
        return done(err, false)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  }))
  passport.use('wechat', new WechatStrategy({
      appID: config.WeiXinAppId,
      // name:{默认为wechat,可以设置组件的名字}
      appSecret: config.WeiXinAppSecret,
      client: 'web', // {wechat|web},
      // callbackURL: {CALLBACKURL},
      scope: 'snsapi_login', // {snsapi_userinfo|snsapi_base},
      // state:{STATE},
      // getToken: {getToken},
      // saveToken: {saveToken}
    },
    function (req, accessToken, refreshToken, profile, expires_in, done) {
      // asynchronous
      process.nextTick(function () {
        // check if the user is already logged in
        if (!req.user) {
          // find the user in the database based on their weixin id
          User.findOne({'weixin.id': profile.id}, function (err, user) {
            if (err)
              return done(err, false)
            // if the user is found, then log them in
            if (user) {
              return done(null, user) // user found, return that user
            } else {
              // if there is no user found with that weixin id, create them
              var newUser = new User()
              // set all of the weixin information in our user model
              newUser.weixin.id = profile.id // set the users weixin id
              newUser.weixin.token = accessToken // we will save the token that weixin provides to the user
              newUser.weixin.name = profile.name // look at the passport user profile to see how names are returned

              // save our user to the database
              newUser.save(function (err) {
                if (err)
                  throw err

                // if successful, return the new user
                return done(null, newUser)
              })
            }

          })
        } else {
          // user already exists and is logged in, we have to link accounts
          var user = req.user
          user.weixin.id = profile.id
          user.weixin.token = accessToken
          user.weixin.name = profile.name

          // save the user
          user.save(function (err) {
            if (err)
              throw err
            return done(null, user)
          })
        }
      })
    }))
}