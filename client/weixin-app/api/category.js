import config from '../utils/config'
const common = require('./common')
const app = getApp()

module.exports.categoryList = function(resolve) {
    wx.request({
      url: `${config.API_URL}/categories`,
      method: 'GET',
      header: common.setHeaders(),
      success: resolve,
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
}