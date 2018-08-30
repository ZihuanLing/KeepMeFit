// pages/coach/modifyCourse/modifyCourse.js
Page({

  // 监视选择器的变化
  OnPickerChange: function (e) {
    var newValue = e.detail.value;
    var Type = e.currentTarget.dataset.type;
    var newData = {};
    newData[Type] = newValue;
    this.setData(newData)
  },

  //提交修改
  SubmitChange: function(e){
    var newCourseInfo = e.detail.value;
    this.setData(newCourseInfo);
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确定要修改吗？',
      success: res => {
        if(res.confirm){
          wx.showLoading();
          that.Coach.ModifyCourse(that.data, ()=>{
            wx.hideLoading();
            wx.showToast({
              title: '修改成功！',
            })
          });
        }
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
    console.log(options)
    var coach = require('../../../tool/Coach.js')
    var Coach = new coach();
    this.Coach = Coach;
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