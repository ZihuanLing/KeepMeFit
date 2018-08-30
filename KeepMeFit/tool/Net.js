// const mainUrl = 'http://127.0.0.1:8080/keepMeFit'
const mainUrl = 'http://192.168.137.175:8080/keepMeFit'
// const mainUrl = 'https://stublockchain.com/keepMeFit'

/**
 * 网络通信模块
 * 只用来从服务器上获取数据
 * 和上传数据
 */
class Net{
  /**
   * @param action 需要执行的动作
   * @param {Object} params 传入的参数
   * @param {Function} cb 回调函数
  */
  GetData(action, params, cb, ignoreTag = false){
    params.action = action;
    wx.request({
      url: mainUrl,
      method: 'GET',
      data: params,
      success: res => {
        var data = res.data;
        if(data.tag || ignoreTag){
          if(cb){ cb(res.data);}
        }else{
          wx.hideLoading();
          wx.showModal({
            title: '网络错误',
            content: data.errMsg,
          })
        }
      },
      fail: res => {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '连接失败，请检查您的网络连接，稍后重试',
        })
      }
    })
  }

  /**
   * 上传数据到服务器数据库
  */
  PostData(action, postData, cb, ignoreTag = false){
    var data = {
      action: action,
      postData, postData
    };
    wx.request({
      url: mainUrl,
      method: 'POST',
      data: data,
      dataType: 'json',
      success: res => {
        var data = res.data;
        if(data.tag || ignoreTag){
          if(cb) cb(data);
        }else{
          wx.hideLoading();
          wx.showModal({
            title: '错误',
            content: data.errMsg,
          })
        }
      },
      fail: res => {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '连接失败，请检查您的网络连接，稍后重试',
        })
      }
    })
  }
}

module.exports = Net;