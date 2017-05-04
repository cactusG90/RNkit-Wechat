let md5 = require("../MD5.js");
let checkNetWork = require("../CheckNetWork.js");
let app = getApp();
Page({
  data: {
    focus: false,
    btnDisabled: true,
    userLogin: {
      loginName: '',
      password: ''
    }

  },
  userInput: function(e) {  //手机号输入
    let inputValue = e.detail.value;
      this.setData({
        'userLogin.loginName': inputValue
      });
  },
  pswInput: function(e) {   //密码输入
    let that = this;
    let inputValue = e.detail.value;
    let md5Psw = md5.hexMD5(inputValue);
    let length = e.detail.value.length;
    if(length >= 6 && length <= 20){ 
      that.setData({
        'userLogin.password': md5Psw,
        btnDisabled: false
      })
    } 
  },
  // 登陆接口调用成功回调
  successFun: function(res, selfObj) {
    console.log(res)
    let statu = res.errno;
    let message = res.errmsg;
    if(statu == 0){
      let token = res.data.token;
      let userName = res.data.user.name;
      wx.showToast({
        title: '登录成功'
      })
      try {
          wx.setStorageSync('token', token)
      } catch (e) {    
      }
      try {
          wx.setStorageSync('userName', userName)
      } catch (e) {    
      }
      wx.reLaunch({
        url: '../appList/appList'
      })
    }
  },
  bindButtonTap: function() { //登陆按钮
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误');
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    }else {
      let url = app.apiUrl + '/auth/login';
      let params = that.data.userLogin;
      console.log(params);
      app.request.requestPostApi(url, params, this, this.successFun)
    }
  },
  onLoad: function () {
    try {
        wx.setStorageSync('token', '')
    } catch (e) {    
    }
  }
})
