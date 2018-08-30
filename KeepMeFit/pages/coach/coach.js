// pages/coach/coach.js
var coach = require('../../tool/Coach.js');
var Coach = new coach();
Page({

  // 创建新课程
  ToNewCourse: function(){
    var coachId = this.data.userInfo.coachId;
    wx.navigateTo({
      url: 'newCourse/newCourse?coachId='+coachId,
    })
  },

  // 跳转到学员列表 -- 也是课程详情
  ToStudentList: function(e){
    wx.showLoading();
    var courseId = e.currentTarget.dataset.courseId;
    wx.navigateTo({
      url: './studentList/studentList?courseId='+courseId,
      complete: ()=>{
        wx.hideLoading();
      }
    })
  },

  // 退出登录
  ExitCoach: function(){
    wx.showLoading({
      title: '正在退出',
    })
    wx.clearStorageSync();
    wx.reLaunch({
      url: '../login/login',
      success: wx.showToast({
        title: '成功',
      })
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    courses: [],
    dataLoaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({userInfo: userInfo})
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
    Coach.GetCourses(courses => {
      this.setData({
        courses: courses,
        dataLoaded: true
      })
      wx.hideLoading();
    }, !this.data.dataLoaded);
  },

})