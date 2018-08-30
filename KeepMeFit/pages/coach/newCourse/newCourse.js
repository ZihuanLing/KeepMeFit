// pages/coach/newCourse/newCourse.js
Page({

  // 监视选择器的变化
  OnPickerChange:function(e){
    var newValue = e.detail.value;
    var Type = e.currentTarget.dataset.type;
    var newData = {};
    newData[Type] = newValue;
    this.setData(newData)
  },

  // 提交创建的数据
  CreateNewCourse: function(e){
    wx.showLoading({
      title: '正在创建',
    });
    var newCourse = e.detail.value;
    var coach = require('../../../tool/Coach.js')
    var Coach = new coach();
    Coach.CreateNewCourse(newCourse, () => {
      wx.hideLoading();
      var that = this;
      wx.showModal({
        title: '创建成功',
        content: '新的课程已创建成功，您可以返回查看',
        confirmText: '返回',
        cancelText: '继续创建',
        success: res => {
          if(res.confirm){
            wx.navigateBack({
              delta: 1
            })
          }else if(res.cancel){
            that.setData({defaultValue: ''})
          }
        }
      })
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    pickerTime: '00:00',
    defaultValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    var thisDate = date.toLocaleDateString();
    thisDate = thisDate.replace(/\//g, '-')
    this.setData({
      coachId: options.coachId,
      startDate: thisDate,
      endDate: thisDate
    })
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