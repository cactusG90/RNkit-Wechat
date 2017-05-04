let checkNetWork = require("../CheckNetWork.js");
let utils = require("../../utils/util.js")
let app = getApp();
Page({
  data: {
    app_key: '',  // appKey
    appInfo: {},  //app详情
    btnDisable: true,   //按钮是否可点击
    patchKey: '',   //patchKey
    patchList:[], //补丁包列表
    patchPage: 1, //patch列表页数
    patchTotalPages: 1,   //patch列表总页数
    paramObject:{ 
      app_key: '',//应用的key,
      version_key: '',//补丁的key,
      name: '',  //补丁名称,
      release_type: 1,  //发布类型(1: 开发预览, 2: 全量下发, 3: 灰度发布, 4: 条件下发, 默认: 2)
      gray_type: 1, //灰度下发类型 (1: 百分比, 2: 设备数量, 默认1)(可选)
      gray_percent: 2,  //灰度百分比 (1-9 分别为百分之10-90, 默认百分之20)(可选)
      gray_count: 100,  //灰度设备数量 (默认为100)(可选)
      condition: '', //灰度条件 (如 iOS>=9)(可选)
      is_mandatory: 0,  //是否强制更新 (0: 否, 1: 是, 默认: 0)(可选)
      is_silent: 0, //是否静默更新 (0: 否, 1: 是, 默认: 0)(可选)
      release_time: '',  //发布时间 (格式为 2017-02-21 00:41:55, 默认为当前时间, 表示立即发布)(可选)
      description: '', //更新描述(可选)
      meta_info: '', //扩展字段, 格式为 json 字符串(可选)
      package_key: '' //Package的 key(可选) 
    },
    // 发布类型
    releaseRadio: [
      {name: '1', value: '开发预览', checked: ''},
      {name: '2', value: '全量下发', checked: ''},
      {name: '3', value: '灰度发布', checked: ''},
      {name: '4', value: '条件下发', checked: ''},
    ],
    // 灰度下发类型
    grayRadio: [
      {name: '1', value: '百分比', checked: ''},
      {name: '2', value: '设备数量', checked: ''}
    ],
    // 条件下法 下发条件
    // objectArray: [
    //   '中国', '美国', '巴西', '日本'
    // ],
    // index: 0,
    //发布时间
    date: utils.formatTime().substring(0,10)
  },
  //补丁包名输入
  nameInput: function(e) {  
    let that = this;
    that.setData({
      'paramObject.name': e.detail.value,
    })
    if(that.data.paramObject.name != ''){
      that.setData({
        'btnDisable': false
      })
    }else{
      that.setData({
        'btnDisable': true
      })
    }
  },
  //发布类型选择
  releaseChange: function(e) {
    let that = this;
    that.setData({
      'paramObject.release_type': e.detail.value,
      'btnDisable': false
    });
  },
  //灰度下发类型选择
  grayChange: function(e) {
    let that = this;
    that.setData({
      'paramObject.gray_type': e.detail.value,
      'btnDisable': false
    });
  },
  //灰度下发类型选择 百分比
  slider4change:function(e){
    let that = this;
    let gray_percent = e.detail.value / 10
    that.setData({
      'paramObject.gray_percent': gray_percent,
      'btnDisable': false
    });
  },
  // 灰度下发类型选择 灰度设备数量
  grayCount: function(e) {
    let that = this;
    that.setData({
      'paramObject.gray_count': e.detail.value,
    })
    if(that.data.paramObject.gray_count != ''){
      that.setData({
        'btnDisable': false
      })
    }else{
      that.setData({
        'btnDisable': true
      })
    }
  },
  // 是否强制更新
  switch1Change: function (e){
    let that = this;
    that.setData({
      'btnDisable': false,
    })
    if(e.detail.value){
      that.setData({
        'paramObject.is_mandatory': 1,
        'paramObject.is_silent': 0
      })
    }else{
      that.setData({
        'paramObject.is_mandatory': 0
      })
    }
  },
  // 是否静默更新
  switch2Change: function (e){
    let that = this;
    that.setData({
      'btnDisable': false,
    })
    if(e.detail.value){
      that.setData({
        'paramObject.is_silent': 1,
        'paramObject.is_mandatory': 0,
      })
    }else{
      that.setData({
        'paramObject.is_silent': 0
      })
    }
  },
  //时间
  bindDateChange: function(e) {
    let time = e.detail.value + utils.formatTime().substring(10,);
    this.setData({
      date: time,
      'paramObject.release_time': time,
      'btnDisable': false
    })
  },
  //更新描述
  bindTextAreaBlur: function(e) {
    this.setData({
      'paramObject.description': e.detail.value,
      'btnDisable': false
    })
  },
  // 获取appKey、patchKey
  appInfo: function(event) {
    let that = this;
    try {
      var value1 = wx.getStorageSync('appKey');
      var value2 = wx.getStorageSync('patchKey');
      if (value1) {
          that.setData({
          'app_key': value1,
          'paramObject.app_key': value1
        })
        that.loadApp(); //获取app详情
      }
      if(value2){
        that.setData({
          'patchKey': value2,
          'paramObject.version_key': value2
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
  // 获取补丁包列表成功回调
  PatchSuccess: function(res, selfObj){
    let data = res.data;
    let list = selfObj.data.patchList;
    let patchKey = selfObj.data.patchKey;
    for(let i = 0; i < data.data.length; i++){
      list.push(data.data[i]);
      let key = data.data[i].key;
      if(key === patchKey){
        selfObj.setData({
          'patchList': data.data[i],
          'paramObject.name': data.data[i].name,  //补丁名称,
          'paramObject.release_type': (data.data[i].release_type > 0) ? data.data[i].release_type : 2,  //发布类型(1: 开发预览, 2: 全量下发, 3: 灰度发布, 4: 条件下发, 默认: 2)
          'paramObject.gray_type': (data.data[i].gray_type > 0) ? data.data[i].gray_type : 1, //灰度下发类型 (1: 百分比, 2: 设备数量, 默认1)(可选)
          'paramObject.gray_percent': (data.data[i].gray_percent > 0) ? data.data[i].gray_percent : 2,  //灰度百分比 (1-9 分别为百分之10-90, 默认百分之20)(可选)
          'paramObject.gray_count': (data.data[i].gray_count > 0) ? data.data[i].gray_count : 100,  //灰度设备数量 (默认为100)(可选)
          'paramObject.condition': data.data[i].condition, //灰度条件 (如 iOS>=9)(可选)
          'paramObject.is_mandatory': data.data[i].is_mandatory,  //是否强制更新 (0: 否, 1: 是, 默认: 0)(可选)
          'paramObject.is_silent': data.data[i].is_silent, //是否静默更新 (0: 否, 1: 是, 默认: 0)(可选)
          'paramObject.release_time': utils.formatTime(data.data[i].release_time),  //发布时间 (格式为 2017-02-21 00:41:55, 默认为当前时间, 表示立即发布)(可选)
          'paramObject.description':data.data[i].description, //更新描述(可选)
          'paramObject.meta_info':data.data[i].meta_info, //扩展字段, 格式为 json 字符串(可选)
          'paramObject.package_key': '' //Package的 key(可选) 
        })
      }
    }
    let index1 = selfObj.data.paramObject.release_type;
    let index2 = selfObj.data.paramObject.gray_type;
    let time = selfObj.data.paramObject.release_time;
    let releaseRadio = selfObj.data.releaseRadio;
    let grayRadio = selfObj.data.grayRadio;
    releaseRadio[index1-1].checked = 'true';
    grayRadio[index2-1].checked = 'true';
    selfObj.setData({
      'releaseRadio': releaseRadio,
      'grayRadio': grayRadio,
      'date': time,
      'paramObject.release_time':time,
      'patchTotalPages': data.totalPages,
      'patchPage': data.currentPage,
    });
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
  //编辑成功回调
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
  //编辑按钮
  EditTap: function() {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误');
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    }else {
      let url = app.apiUrl + '/version/update';
      let params = that.data.paramObject;
      console.log(params)
      app.request.requestPostApi(url, params, this, this.EditSuccess)
    }
  },
  onLoad: function () {
    var that = this;
    that.appInfo(); //获取appKey
  }
})
