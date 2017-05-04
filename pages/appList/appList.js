let checkNetWork = require("../CheckNetWork.js");
let app = getApp();
Page({
  data: {
    currentPage: {
      page: 1
    },  //加载的页码
    totalPages: 1,  //总页数
    appInfo: [],
  },
  // 成功回调
  successFun: function(res, selfObj){
    if(res.errno == 0){
      let data = res.data;
      let list = selfObj.data.appInfo;
      for(let i = 0; i < data.data.length; i++){
          list.push(data.data[i]);
      }
      selfObj.setData({
        'currentPage.page': data.currentPage,
        'totalPages': data.totalPages,
        'appInfo' : list
      });
      let pages = selfObj.data.currentPage.page + 1;
      selfObj.setData({
        'currentPage.page': pages,
      })
    }
  },
  // 加载app列表，10个每页
  loadPage: function(){
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误');
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    }else {
      let url = app.apiUrl + '/app/list';
      let params = that.data.currentPage;
      app.request.requestGetApi(url, params, this, this.successFun)
    }
  },
  onShow: function () {
    let that = this;
    that.setData({
      'currentPage.page': 1,
      'totalPages': 1,  //总页数
      'appInfo': []
    })
    try {
      var value = wx.getStorageSync('token');
      if (value) {
          that.loadPage();
      }
    } catch (e) {}

  },
  //  点击存储appKey
  appInfo: function(event) {
    console.log(event.currentTarget.dataset.key);
    let appKey = event.currentTarget.dataset.key;
    try {
        wx.setStorageSync('appKey', appKey);
        wx.navigateTo({
          url: '../appInfo/appInfo'
        })
    } catch (e) {    
    }
  },
})
