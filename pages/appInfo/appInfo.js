let checkNetWork = require("../CheckNetWork.js");
let utils = require("../../utils/util.js")
let app = getApp();
Page({
  data: {
    titles: ["package", "补丁包"],   // 定义标题的数组
    selectedTitle: "0",   // 定义选中标题的初始值0
    app_key: '',  // appKey
    appInfo: {},  //app详情
    packagePage: 1, //package列表页数
    packageTotalPages: 1,   //package列表总页数
    packageList: [],  //package列表
    patchPage: 1, //patch列表页数
    patchTotalPages: 1,   //patch列表总页数
    patchList: [],  //patch列表
    createdTime:'',
  },
  // 定义点击标题的事件处理函数，将选中标题的id赋值给selectedTitle
  bindtap: function (e) {
    // console.log(e)
    this.setData({
      selectedTitle: e.currentTarget.id
    });
  },
  //定义滑块改变的事件处理函数，将current赋值给selectedTitle
  bindChange: function (e) {
    this.setData({
      selectedTitle: e.detail.current
    })
  },
  // 获取appKey
  appInfo: function(event) {
    let that = this;
    try {
      var appKey = wx.getStorageSync('appKey')
      if (appKey) {
          // Do something with return value
        console.log(appKey)
        that.setData({
          'app_key': appKey
        })
        that.loadApp(); //获取app详情
        that.loadPackage();   //获取package列表
        that.loadPatch();   //获取patch列表
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  // 获取app信息成功回调
  appSuccess: function(res, selfObj){
    selfObj.setData({
      'appInfo': res.data
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
  // 获取package列表成功回调
  PackageSuccess: function(res, selfObj){
    let data = res.data;
    let list = selfObj.data.packageList;
    for(let i = 0; i < data.data.length; i++){
      list.push(data.data[i]);
    }
    // 处理package时间格式
    for(let i = 0; i < list.length; i++){
      let time = utils.formatTime(list[i].created_at);
      list[i].created_at = time;
      // 处理package patch时间格式
      let patch= list[i].version;
      for(let j = 0; j< patch.length; j++){
        let patchTime = utils.formatTime(patch[j].release_time)
        patch[j].release_time = patchTime;
      }
    }
    selfObj.setData({
      'packageList': list,
      'packageTotalPages': data.totalPages,
      'packagePage': data.currentPage,
    })
    // 页面+1，再次请求时访问下一页
    let pages = selfObj.data.packagePage + 1;
    selfObj.setData({
      'packageList': list,
    })
  },
  // 获取package列表
  loadPackage: function(){
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误');
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    }else {
      let url = app.apiUrl + '/package/list';
      let params = {
        'app_key': that.data.app_key,
        'page': that.data.packagePage,
      };
      app.request.requestGetApi(url, params, this, this.PackageSuccess)
    }
  },
  // 获取补丁包列表成功回调
  PatchSuccess: function(res, selfObj){
    let data = res.data;
    let list = selfObj.data.patchList;
    for(let i = 0; i < data.data.length; i++){
        list.push(data.data[i]);
    }
    // 处理补丁包时间格式
    for(let i = 0; i < list.length; i++){
      let createdTime = utils.formatTime(list[i].created_at);
      let releaseTime = utils.formatTime(list[i].release_time);
      list[i].created_at = createdTime;
      list[i].release_time = releaseTime;
    }
    selfObj.setData({
      'patchList': list,
      'patchTotalPages': data.totalPages,
      'patchPage': data.currentPage,
    })
    // console.log(selfObj.data.patchList)
    let pages = selfObj.data.patchPage + 1;
    selfObj.setData({
      'patchPage': pages,
    })
  },
  // 获取patch列表
  loadPatch: function(){
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误');
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    }else {
      let url = app.apiUrl + '/version/list';
      let params = {
        'app_key': that.data.app_key,
        'page': that.data.patchPage,
      };
      app.request.requestGetApi(url, params, this, this.PatchSuccess)
    }
  },
  packageTap: function(event){
    let packageName = event.currentTarget.dataset.name;
    let packageKey = event.currentTarget.dataset.packagekey;
    let patchKey = event.currentTarget.dataset.patchkey;
    let patchName = event.currentTarget.dataset.patchname;
    let status = event.currentTarget.dataset.status;
    let packageInfo = {
      packageName: packageName,
      packageKey: packageKey,
      patchKey: patchKey,
      patchName: patchName,
      status: status,
    };
    try {
      wx.setStorageSync('packageInfo', packageInfo)
    } catch (e) {    
    }
    wx.navigateTo({
      url: '../package/package'
    })
  },
  patchTap:function(event){
    let patchKey = event.currentTarget.dataset.patchkey;
    try {
      wx.setStorageSync('patchKey', patchKey)
    } catch (e) {    }
    wx.navigateTo({
      url: '../patch/patch'
    })
  },
  onShow: function() {
    var that = this;
    that.setData({
      'app_key': '',  // appKey
      'appInfo': {},  //app详情
      'packagePage': 1, //package列表页数
      'packageTotalPages': 1,   //package列表总页数
      'packageList': [],  //package列表
      'patchPage': 1, //patch列表页数
      'patchTotalPages': 1,   //patch列表总页数
      'patchList': [],  //patch列表
      'createdTime':'',
    })
    that.appInfo(); //获取appKey
  }
})
