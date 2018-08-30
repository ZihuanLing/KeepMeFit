// pages/student/student.js
var Util = require("../../tool/util.js")
var util = new Util();

Page({

  // 跳转到课程列表
  ToCourseList: function(){
    wx.navigateTo({
      url: './courseList/courseList',
    })
  },

  // 查看课程细节
  ViewCourseDetail: function(e){
    var id = e.currentTarget.dataset.id,
        myCourses = this.data.myCourses;
    var detailCourse = myCourses.find(value => {
      return value._id == id
    })
    this.setData({
      dtc: detailCourse,
      showDetail: true
    })
  },

  // 隐藏课程细节
  HideDetailCourse:function(){
    this.setData({showDetail: false})
  },

  // 取消预约的课程
  CancelCourse: function(e){
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确认要取消预约该课程吗？',
      success: res => {
        if(res.confirm){
          wx.showLoading({
            title: '正在取消...',
          })
          var User = require('../../tool/Student.js')
          var me = new User();
          me.CancelCourse(id, ()=>{
            var myCourses = that.data.myCourses;
            var idx = myCourses.findIndex(value => {return value._id == id});
            myCourses.splice(idx, 1);
            that.setData({
              myCourses: myCourses,
              showDetail: false,
              dtc: {}
            })
            wx.hideLoading();
            wx.showToast({
              title: '取消成功',
            })
          });
        }
      }
    })
  },

  // 获取一个即将上课的课程
  GetOCC: function(courses){
    if(courses.length == 0) return;
    var courses = courses;
    courses.sort((a, b) => {
      var v1 = a.time.replace(/:/g, '')
      var v2 = b.time.replace(/:/g, '')
      return v1 - v2;
    })
    var d = new Date();
    var now = d.toLocaleTimeString();
    var occ = courses.find(value => {
      return now < value.time;
    })
    if(!occ) occ = courses[0];
    this.setData({occ: occ})
  },

  // 用户退出
  UserExit: function(){
    wx.showModal({
      title: '提示',
      content: '您确定要退出吗？',
      success: res => {
        if(res.confirm){
          wx.clearStorageSync();
          wx.reLaunch({
            url: '../login/login',
          })
        }
      }
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    showDetail: false,
    dtc: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading();
    var userType = wx.getStorageSync('userType');
    if(userType != 'student'){
      wx.setStorageSync('isLogin', false);
      wx.reLaunch({
        url: '../login/login',
        success: wx.hideLoading()
      })
    }else{
      wx.hideLoading();
    }
  },

  onShow: function(e){
    var userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      var that = this;
      setTimeout(() => {
        that.onShow(e);
      },500);
      return;
    }else{
      this.setData({userInfo: userInfo})
    }
    util.GetAllCoursesData(data => {
      var myCourseIds = userInfo.myCourses;
      var courses = data.result;
      var myCourses = []
      for (let i in myCourseIds) {
        var tmp = courses.find(target => { return target._id == myCourseIds[i] })
        if (tmp) myCourses.push(tmp);
      }
      this.GetOCC(myCourses);
      this.setData({
        myCourses: myCourses
      })
    });
  }

})