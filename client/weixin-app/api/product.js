import config from '../utils/config'
const common = require('./common')
const app = getApp()

module.exports.productList = function(resolve) {
    wx.request({
      url: `${config.API_URL}/products`,
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
module.exports.productListByBrand = function(brandId, resolve) {
    wx.request({
      url: `${config.API_URL}/products/brand/${brandId}`,
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
module.exports.productListByCategory = function(categoryId, resolve) {
    wx.request({
      url: `${config.API_URL}/products/category/${categoryId}`,
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
module.exports.productReadOne = function(productId, resolve){
    wx.request({
      url: `${config.API_URL}/products/${productId}`,
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