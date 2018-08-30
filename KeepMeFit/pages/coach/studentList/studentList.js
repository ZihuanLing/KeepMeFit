// pages/coach/studentList/studentList.js
Page({

  // 跳转到修改课程页面
  ToModifyCourse: function(){
    wx.showLoading();
    var courseId = this.data._id;
    wx.navigateTo({
      url: '../modifyCourse/modifyCourse?courseId='+courseId,
      complete: () => {
        wx.hideLoading();
      }
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
    var coach = require('../../../tool/Coach.js')
    var Coach = new coach();
    var course = Coach.GetCourseById(options.courseId);
    this.setData(course);
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