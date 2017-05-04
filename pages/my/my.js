let checkNetWork = require("../CheckNetWork.js");
let utils = require("../../utils/util.js")
let app = getApp();
Page({
  data: {
   userName: '',
   token: '',
  },
  // 登陆接口调用成功回调
  successFun: function(res, selfObj) {
    let statu = res.errno;
    let message = res.errmsg;
    if(statu == 0){
      wx.showToast({
        title: '请重新登录'
      })
      wx.reLaunch({
        url: '../login/login'
      })
    }
  },
  logOut: function() {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误');
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    }else {
      let url = app.apiUrl + '/auth/logout';
      let params = that.data.userLogin;
      app.request.requestPostApi(url, params, this, this.successFun)
    }
  },
  onShow: function() {
    let that = this;
    try {
      var userName = wx.getStorageSync('userName');
      let token = wx.getStorageSync('token');
      if (userName) {
        that.setData({
          'userName': userName
        })
      }else if(token){
        that.setData({
          'token': token
        })
      }
    } catch (e) {}
    
  },

})
