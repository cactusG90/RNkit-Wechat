let md5 = require("../MD5.js");
let checkNetWork = require("../CheckNetWork.js");
let app = getApp();
Page({
  data: {
    btnDisabled: true,
    changePsw: {
      old_password: '',
      new_password: ''
    }

  },
  oldPsw: function(e) {   //密码输入
    let that = this;
    let inputValue = e.detail.value;
    let md5Psw = md5.hexMD5(inputValue);
    let length = e.detail.value.length;
    if(length >= 6 && length <= 20){ 
      that.setData({
        'changePsw.old_password': md5Psw,
      })
    } 
  },
  newPsw: function(e) {   //密码输入
    let that = this;
    let inputValue = e.detail.value;
    let md5Psw = md5.hexMD5(inputValue);
    let length = e.detail.value.length;
    if(length >= 6 && length <= 20){ 
      that.setData({
        'changePsw.new_password': md5Psw,
        btnDisabled: false
      })
    } 
  },
  // 登陆接口调用成功回调
  successFun: function(res, selfObj) {
    let statu = res.errno;
    let message = res.errmsg;
    if(statu == 0){
      let token = res.data.token;
      let userName = res.data.user.name;
      wx.showToast({
        title: '修改成功'
      })
      wx.reLaunch({
        url: '../login/login'
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
      let url = app.apiUrl + '/auth/change_password';
      let params = that.data.changePsw;
      app.request.requestPostApi(url, params, this, this.successFun);
    }
  }
})
