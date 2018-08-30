// pages/login/coachLogin/coachLogin.js
var util = require('../../../tool/util.js')
var Util = new util();

Page({

  // 校验登录
  LoginCheck: function(e){
    wx.showLoading({
      title: '正在登陆',
    })
    // 初步校验本地登录
    var info = e.detail.value;
    Util.CheckUser(info, (checkResult) => {
      if(checkResult.state){
        wx.showToast({
          title: '登录成功！',
        })
        // 登录校验通过，检查用户数据是否完善
        // 检查用户姓名和电话
        var isInfoComplete = checkResult.isInfoComplete;
        if(!isInfoComplete){
          wx.navigateTo({
            url: '../completeInfo/completeInfo?userType=coach',
          })
        }else{
          wx.setStorage({
            key: 'userType',
            data: 'coach',
          })
          wx.setStorage({
            key: 'isLogin',
            data: true,
          })
          setTimeout(function(){
            wx.reLaunch({
              url: '../../coach/coach',
            })
          }, 500)
        }
      }else{
        wx.showModal({
          title: '登录失败',
          content: '您输入的账号或密码错误，请重新输入，如忘记密码可联系管理员找回。',
        })
      }
    });    
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
    // 正常的进入情况下，options携带的是用户信息userInfo
    // this.__userInfo__ = options;
    // this.setData(options);
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({avatarUrl: userInfo.avatarUrl});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})