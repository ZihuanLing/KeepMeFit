// pages/login/login.js
Page({

  StudentLogin: function(e){
    var userInfo = e.detail.userInfo;
    var student = require('../../tool/Student.js') 
    var Me = new student();
    Me.LogMeIn(userInfo, (result) => {
      if(result.loginState && result.isInfoComplete){
        wx.setStorageSync('isLogin', true);
        wx.setStorageSync('userType', 'student');
        wx.reLaunch({
          url: '../student/student',
        })
      }else{
        wx.navigateTo({
          url: './completeInfo/completeInfo?userType=student',
          success: () => {
            wx.hideLoading();
          }
        })
      }
    });    
  },

  ToCoachLogin: function(e){
    var userInfo = e.detail.userInfo;
    var avatarUrl = userInfo.avatarUrl;
    wx.setStorage({
      key: 'userInfo',
      data: userInfo,
      success: ()=>{
        wx.navigateTo({
          url: './coachLogin/coachLogin?avatarUrl='+avatarUrl,
          success: ()=>{
            wx.hideLoading();
          }
        })
      }
    })
  },

  showLoading: function(){
    wx.showLoading({
      title: "请稍后"
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
    var isLogin = wx.getStorageSync('isLogin');
    if(isLogin){
      var userType = wx.getStorageSync('userType');
      if(userType == 'coach'){
        wx.reLaunch({
          url: '../coach/coach',
        })
      }else if(userType == 'student'){
        wx.reLaunch({
          url: '../student/student',
        })
      }
      wx.hideLoading();
    }else{
      wx.hideLoading();
    } 
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