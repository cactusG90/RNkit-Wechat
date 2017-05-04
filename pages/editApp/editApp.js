let checkNetWork = require("../CheckNetWork.js");
let utils = require("../../utils/util.js")
let app = getApp();
Page({
  data: {
    app_key: '',  // appKey
    appInfo: {},  //app详情
    btnDisable: true,   //按钮是否可点击
    name: '',
    download_url: '',
  },
  // 获取appKey
  appInfo: function(event) {
    let that = this;
    try {
      var value = wx.getStorageSync('appKey');
      if (value) {
          that.setData({
          'app_key': value
        })
        that.loadApp(); //获取app详情
      }
    } catch (e) {}
  },
  // 获取app信息成功回调
  appSuccess: function(res, selfObj){
    // 处理时间格式
    res.data.created_at = utils.formatTime(res.data.created_at);
    selfObj.setData({
      'appInfo': res.data,
      'name': res.data.name,
      'download_url': res.data.download_url,
    })
  },
  // 获取app详情
  loadApp: function(){
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误');
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    }else {
      let url = app.apiUrl + '/app/info';
      let params = {
        'app_key': that.data.app_key,
      }
      app.request.requestGetApi(url, params, this, this.appSuccess)
    }
  },
  nameInput: function(e) {  //应用名输入
    let that = this;
    let inputValue = e.detail.value;
      that.setData({
        'name': inputValue
      })
    if(that.data.name != ''){
      that.setData({
        'btnDisable': false
      })
    }else{
      that.setData({
        'btnDisable': true
      })
    }
  },
  urlInput: function(e) {   //下载地址输入
    let that = this;
    let inputValue = e.detail.value;
      that.setData({
        'download_url': inputValue,
        'btnDisable': false
      })
  },
  EditSuccess: function(res, selfObj) {
    let statu = res.errno;
    let message = res.errmsg;
    if(statu == 0){
      let token = res.data.token;
      wx.showToast({
        title: '修改成功'
      })
      wx.navigateBack({
        url: '../appInfo/appInfo'
      })
    }
  },
  EditTap: function() {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误');
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    }else {
      let url = app.apiUrl + '/app/edit';
      let params = {
        key: that.data.app_key,
        name: that.data.name,
        download_url: that.data.download_url,
      };
      app.request.requestPostApi(url, params, this, this.EditSuccess)
    }
  },
  onReady: function () {
    var that = this;
    that.appInfo(); //获取appKey
  }
})
