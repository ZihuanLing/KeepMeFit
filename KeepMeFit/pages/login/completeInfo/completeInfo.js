// pages/login/completeInfo/completeInfo.js
Page({

  CompleteInfo: function(e){
    var value = e.detail.value;
    for(let key in value){
      if(!value[key]){
        wx.showModal({
          title: '提示',
          content: '您输入的信息不完整，请重试。',
          showCancel: false
        })
        return;
      }
    }
    wx.showLoading({
      title: '正在提交...',
    })
    setTimeout(()=> {wx.hideLoading();}, 6000);
    var userType = this.data.userType;
    var reLaunchUrl;
    if(userType == 'coach'){
      reLaunchUrl = '../../coach/coach';
    }else{
      reLaunchUrl = '../../student/student'
    }
    var Util = require('../../../tool/util.js')
    var util = new Util();
    // 用户数据绑定信息
    var userInfo = wx.getStorageSync('userInfo');
    for (let key in value) {
      userInfo[key] = value[key]
    }
    // 用户数据上传到服务器
    util.UploadInfo(userInfo, userType, (data) => {
      userInfo._id = data._id;
      wx.setStorage({
        key: 'userInfo',
        data: userInfo,
        success: () => {
          wx.hideLoading();
          wx.showToast({
            title: '已完善',
          })
          wx.setStorage({
            key: 'userType',
            data: userType,
          })
          wx.setStorage({
            key: 'isLogin',
            data: true,
          })
          wx.reLaunch({
            url: reLaunchUrl,
          })
        }
      })
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options)
  },
})