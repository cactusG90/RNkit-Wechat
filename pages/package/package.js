let checkNetWork = require("../CheckNetWork.js");
let utils = require("../../utils/util.js")
let app = getApp();
Page({
  data: {
    app_key: '',  // appKey
    appInfo: {},  //app详情
    btnDisable: true,   //按钮是否可点击
    packageName: '',  //package名称
    nameChange: false,  //packageName是否修改
    packageKey: '',   //packageKey
    patchKey: '',   //补丁包key
    status: 1,  //启用状态，1启用，2禁用
    statusChange: false,  //启用状态是否修改
    patchList:[], //补丁包列表
    patchPage: 1, //patch列表页数
    patchTotalPages: 1,   //patch列表总页数
    index:0,  //选择的补丁包
  },
  // 获取appKey、packageInfo
  appInfo: function(event) {
    let that = this;
    try {
      var value1 = wx.getStorageSync('appKey');
      var value2 = wx.getStorageSync('packageInfo');
      if (value1) {
          that.setData({
          'app_key': value1
        })
        that.loadApp(); //获取app详情
      } 
      if(value2){
        let patchList = [{
          name: value2.patchName,
          key: value2.patchKey,
        }]
        that.setData({
          'packageName': value2.packageName,
          'packageKey': value2.packageKey,
          'patchKey': value2.patchKey,
          'status': value2.status,
          'patchList': patchList
        })
        that.loadPatch();
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
  nameInput: function(e) {  //package名输入
    let that = this;
    let inputValue = e.detail.value;
      that.setData({
        'packageName': inputValue,
        'nameChange': true
      })
    if(that.data.packageName != ''){
      that.setData({
        'btnDisable': false
      })
    }else{
      that.setData({
        'btnDisable': true
      })
    }
  },
  // 获取补丁包列表成功回调
  PatchSuccess: function(res, selfObj){
    let data = res.data;
    let list = selfObj.data.patchList;
    for(let i = 0; i < data.data.length; i++){
      let name = data.data[i].name;
      let key = data.data[i].key;
      if(name != list[0].name){
        let patch = {
          name: name,
          key: key,
        }
        list.push(patch);
      }
    }
    selfObj.setData({
      'patchList': list,
      'patchTotalPages': data.totalPages,
      'patchPage': data.currentPage,
    })
    let pages = selfObj.data.patchPage + 1;
    selfObj.setData({
      'patchPage': pages,
    });
    if(selfObj.data.patchPage <= selfObj.data.patchTotalPages){
      selfObj.loadPatch();
    }
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
  // 选择是否启用
  switch1Change: function (e){
    let that = this;
    that.setData({
      'btnDisable': false,
      'statusChange': true
    })
    if(e.detail.value){
      that.setData({
        'status': 1
      })
    }else{
      that.setData({
        'status': 2
      })
    }
  },
  // picker选择补丁包
   bindPickerChange: function(e) {
    var index = e.detail.value;
    var ins = this.data.patchList[index].key;
    this.setData({
      index: e.detail.value,
      'btnDisable': false,
      'patchKey': ins
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
      if(that.data.nameChange){
        let nameURL = app.apiUrl + '/package/update';
        let params = {
          name: that.data.packageName,
          app_key: that.data.app_key,
          package_key: that.data.packageKey
        }
        console.log(params);
        app.request.requestPostApi(nameURL, params, this, this.EditSuccess)
      }
      if(that.data.statusChange){
        let statusURL = app.apiUrl + '/package/update_status';
        let params = {
          status: that.data.status,
          package_key: that.data.packageKey
        }
        console.log(params);
        app.request.requestPostApi(statusURL, params, this, this.EditSuccess)
      }
      if(that.data.index !== 0){
        let addURL = app.apiUrl + '/package/add_version';
        let params = {
          version_key: that.data.patchKey,
          package_key: that.data.packageKey
        }
        console.log(params);
        app.request.requestPostApi(addURL, params, this, this.EditSuccess)
      }
      
    }
  },
  onLoad: function () {
    var that = this;
    that.appInfo(); //获取appKey
  }
})
