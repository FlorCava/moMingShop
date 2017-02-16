import config from '../utils/config'
const common = require('./common')
const app = getApp()

module.exports.authWithWeiXinApp = function(code, iv, encryptedData, resolve) {
    wx.request({
      url: `${config.API_URL}/users/weixin/auth`,
      method: 'POST',
      header: common.setHeaders(),
      body:{
          'code': code,
          'iv': iv,
          'encryptedData': encryptedData
      },
      success: resolve,
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
}