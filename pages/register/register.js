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
      action: 'reg',
    },
    userRegister: {
      name: '',
      mobile: '',
      password: '',
      reg_verify: '',
      reg_type: 'mobile',
    },
  },
  nameInput: function(e) {   //用户名输入
    let that = this;
    let inputValue = e.detail.value;
    let length = e.detail.value.length;
    if(length >= 4 && length <= 12){ 
      that.setData({
        'userRegister.name': inputValue,
      })
    }else{
      that.setData({
        'userRegister.name': '',
      })
    }
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
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误')
    }else {
      let url = app.apiUrl + '/auth/captcha';
      let params = that.data.getCodeParams;
      app.request.requestGetApi(url, params, this, this.successFun);
      that.setData({
        'getCodeBtnProperty.loading': false
      })
    }
  },
  codeInput: function(e) {   //验证码输入
    let that = this;
    let inputValue = e.detail.value;
    let length = e.detail.value.length;
    if( length == 6){ 
      that.setData({
        'userRegister.reg_verify': inputValue,
      })
    }else{
      that.setData({
        'userRegister.reg_verify': '',
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
        'userRegister.password': md5Psw,
        btnDisabled: false
      })
    }else{
      that.setData({
        'userRegister.password': '',
        btnDisabled: true
      })
    }
  },
  successFun: function(res, selfObj) {
  let statu = res.errno; 
    if(statu == 0){
      wx.showToast({
        title: '注册成功，请登录！',
        duration: 2000,
      })
      //跳到登录界面
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  bindButtonTap: function() { //注册按钮
    let that = this;
    let url = app.apiUrl + '/auth/register';
    let params = that.data.userRegister;
    app.request.requestPostApi(url, params, this, this.successFun);
  },
})
