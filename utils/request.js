let token;
/**
 * @desc    API请求接口类封装
 * @author  shangheguang@yeah.net
 * @date    2017-01-20
 */

/**
 * POST请求API
 * @param  {String}   url         接口地址
 * @param  {Object}   params      请求的参数
 * @param  {Object}   sourceObj   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
function requestPostApi(url, params, sourceObj, successFun, failFun, completeFun) {
    requestApi(url, params, 'POST', sourceObj, successFun, failFun, completeFun)
}

/**
 * GET请求API
 * @param  {String}   url         接口地址
 * @param  {Object}   params      请求的参数
 * @param  {Object}   sourceObj   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
function requestGetApi(url, params, sourceObj, successFun, failFun, completeFun) {
    requestApi(url, params, 'GET', sourceObj, successFun, failFun, completeFun)
}

/**
 * 请求API
 * @param  {String}   url         接口地址
 * @param  {Object}   params      请求的参数
 * @param  {String}   method      请求类型
 * @param  {Object}   sourceObj   来源对象
 * @param  {Function} successFun  接口调用成功返回的回调函数
 * @param  {Function} failFun     接口调用失败的回调函数
 * @param  {Function} completeFun 接口调用结束的回调函数(调用成功、失败都会执行)
 */
function requestApi(url, params, method, sourceObj, successFun, failFun, completeFun) {
    
    // 获取token
    wx.getStorage({
      key: 'token',
      success: function(res) {
          token = res.data;
          wx.request({
            url:    url,
            method: method,
            data:   params,
            header: {
                'Content-Type': contentType,
                'X-Authorization': token,
            },
            success: function (res) {
                let statu = res.data.errno;
                let message = res.data.errmsg;
                typeof successFun == 'function' && successFun(res.data, sourceObj);
                if(statu === 0){
                    
                }else if(statu === 401){    //登录态失效
                    wx.showToast({
                        title: '登陆失效，请重新登录！',
                        icon: 'loading',
                        duration: 2000,
                    })
                    wx.navigateTo({
                        url: '../login/login'
                    })
                }else{
                    wx.showToast({
                        title: message,
                        icon: 'loading',
                        duration: 2000,
                    })
                }
            },
            fail: function (res) {
                typeof failFun == 'function' && failFun(res.data, sourceObj);
                wx.showToast({
                    title: '服务繁忙,请稍后再试',
                    icon: 'loading',
                    duration: 2000,
                  })
            },
            complete: function (res) {
                typeof completeFun == 'function' && completeFun(res.data, sourceObj)
            }
        })
      } 
    })
    if (method == 'POST') {
        var contentType = 'application/x-www-form-urlencoded'
    } else {
        var contentType = 'application/json'
    }
    
}

module.exports = { 
  requestPostApi,
  requestGetApi
}
