let md5 = require("../MD5.js");
let checkNetWork = require("../CheckNetWork.js");
let app = getApp();
Page({
  data: {
    focus: false,
    btnDisabled: true,
    getCodeBtnProperty: {
      titileColor: '#B4B4B4',
      disabled: true,
      loading: false,
      title: '获取验证码'
    },
    getCodeParams: {
      account: '',
      action: 'find',
    },
    userRegister: {
      mobile: '',
      new_password: '',
      find_verify: '',
      type: 'mobile',
    },
  },
  userInput: function(e) {  //手机号输入
    let that = this;
    let inputValue = e.detail.value;
    let length = e.detail.value.length;
    if((/^1[34578]\d{9}$/.test(inputValue))){
      that.setData({
        'getCodeParams.account': inputValue,
        'userRegister.mobile': inputValue,
        'getCodeBtnProperty.titileColor': '#9ED99D',
        'getCodeBtnProperty.disabled': false
      })
    }else{
      that.setData({
        'getCodeParams.account': '',
        'userRegister.mobile': '',
        'getCodeBtnProperty.titileColor':'#B4B4B4',
        'getCodeBtnProperty.disabled': true
      })
    }
  },
  codeSuccess: function(res, selfObj) {
    let message = res.errmsg;
    let statu = res.errno;
    if (statu == 0) {
      wx.showToast({
        title: '验证码已发送',
      })
      //启动定时器
      var number=60;
      var time = setInterval(function(){
        number--;
       selfObj.setData({
          'getCodeBtnProperty.title':number + '秒',
          'getCodeBtnProperty.disabled': true
        })
       if(number==0){
          selfObj.setData({
            'getCodeBtnProperty.title':'重新获取',
            'getCodeBtnProperty.disabled': false
          })
          clearInterval(time);
        }
      },1000);
    }else {
      wx.showToast({
        title: message,
        icon: 'loading',
        duration: 2000,
      })
      selfObj.setData({
        'getCodeBtnProperty.titileColor':'#B4B4B4',
        'getCodeBtnProperty.disabled': true
      })
    }
  },
    //获取验证码
  getCodeAct: function() {
    //请求接口
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误')
    }else {
      var that = this;
      let url = app.apiUrl + '/auth/captcha';
      let params = that.data.getCodeParams;
      app.request.requestGetApi(url, params, this, this.successFun);
      that.setData({
        'getCodeBtnProperty.loading': false
      });
    }
  },
  codeInput: function(e) {   //验证码输入
    let that = this;
    let inputValue = e.detail.value;
    let length = e.detail.value.length;
    if( length == 6){ 
      that.setData({
        'userRegister.find_verify': inputValue,
      })
    }else{
      that.setData({
        'userRegister.find_verify': '',
      })
    }
  },
  pswInput: function(e) {   //密码输入
    let that = this;
    let inputValue = e.detail.value;
    let md5Psw = md5.hexMD5(inputValue);
    let length = e.detail.value.length;
    if(length >= 6 && length <= 20){ 
      that.setData({
        'userRegister.new_password': md5Psw,
        btnDisabled: false
      })
    }else{
      that.setData({
        'userRegister.new_password': '',
        btnDisabled: true
      })
    }
  },
successFun: function(res, selfObj) {
  let statu = res.errno; 
    if(statu == 0){
      wx.showModal({
        title: '',
        content: '修改成功，请重新登录！',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          } 
        }
      })
    }
  },
  bindButtonTap: function() { //重置密码按钮
    let that = this;
    let url = app.apiUrl + '/auth/forgot';
    let params = that.data.userRegister;
    app.request.requestPostApi(url, params, this, this.successFun);
  },
})
