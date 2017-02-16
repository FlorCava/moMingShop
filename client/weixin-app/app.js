import config from './utils/config'

App({
  onLaunch: function () {
    this.login()

    var res = wx.getSystemInfoSync();
    this.globalData.windowWidth = res.windowWidth;
  },
  login: function(cb){
    var that = this
    //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code
            
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = res.userInfo
                wx.request({
                  url: `${config.API_URL}/users/weixin/auth`,
                  method: 'POST',
                  header: {
                      'Content-Type':'application/json'
                  },
                  data:{
                      'code': code,
                      'iv': res.iv,
                      'encryptedData': res.encryptedData
                  },
                  success: function(result){
                    console.log(result);
                    that.globalData.token = result.data.token;
                    wx.setStorageSync('token', result.data.token);
                    that.globalData.userInfo = result.data.user;
                    wx.setStorageSync('userInfo', result.data.user);
                    
                    typeof cb == "function" && cb(that.globalData.userInfo)
                  }
                })
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
  },
  getUserInfo: function (cb) {
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      this.login(function(userInfo){
            typeof cb == "function" && cb(userInfo)
        })
    }
  },
  globalData:{
    token: null,
    userInfo: null,
    windowWidth: 0
  }
})