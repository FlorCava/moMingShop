import config from '../utils/config'
const common = require('./common')
const app = getApp()

module.exports.brandList = function(resolve) {
    wx.request({
      url: `${config.API_URL}/brands`,
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