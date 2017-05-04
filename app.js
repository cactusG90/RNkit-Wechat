//app.js

const request = require('utils/request.js')
App({
  
  request: request,

  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    const SDKVersion = wx.getSystemInfoSync().SDKVersion || '1.0.0'
    const [MAJOR, MINOR, PATCH] = SDKVersion.split('.').map(Number)

    const canIUse = apiName => {
      if (apiName === 'showModal.cancel') {
        return MAJOR >= 1 && MINOR >= 1
      }
      return true
    }

    // wx.showModal({
    //   success: function(res) {
    //     if (canIUse('showModal.cancel')) {
    //       console.log(res.cancel)
    //     }
    //   }
    // })
    if (wx.openBluetoothAdapter) {
      wx.openBluetoothAdapter()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  /**
  * 定义的接口域名
  */
  apiUrl: 'https://update.rnkit.io/api/v1',
  globalData:{
    userInfo:null
  }
})
