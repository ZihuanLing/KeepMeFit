// pages/student/courseList/courseList.js
var Util = require('../../../tool/util.js')
var util = new Util();

Page({

  /**
   * 加载课程数据
   * 如果tag是true的话就从服务器下载数据
  */
  LoadCoursesData: function(tag = false){
    if(tag){
      wx.showLoading();
      util.GetAllCoursesData(data => {
        this.setData({ courses: data.result });
        wx.hideLoading();
      })
    }else{
      var courses = wx.getStorageSync('courses');
      this.setData({courses: courses})
      wx.hideLoading();
    }
  },

  // 参加课程
  ParticipateCourse: function(e){
    wx.showModal({
      title: '提示',
      content: '您确定要预约该课程吗？',
      success: res => {
        if(res.confirm){
          wx.showLoading({
            title: '请稍后...',
          })
          var id = e.currentTarget.dataset.id;
          var User = require("../../../tool/Student.js")
          var me = new User();
          me.ParticipateCourse(id)
        }
      }
    })
  },

  // 监视选择器变化
  OnPickerChange:function(e){
    var index = e.detail.value;
    var data = this.data;
    this.setData({
      pickerValue: data.range[index].value,
      name: data.range[index].name
    })
  },

  // 监视输入
  OnInputChange: function(e){
    var value = e.detail.value;
    this.setData({inputValue: value})
  },

  // 查找数据
  SearchData: function(){
    var data = this.data;
    if(data.inputValue == ''){
      // 输入的内容不合法
      wx.showModal({
        title: '错误',
        content: '请输入您要搜索的内容',
        showCancel: false
      })
      return;
    }else{
      wx.showLoading({
        title: '正在查找...',
      })
      // 开始查找数据
      var key = data.name, value = data.inputValue;
      var courses = data.courses;
      var result = courses.filter(target => {
        return target[key].search(value) != -1;
      })
      wx.hideLoading();
      if(result.length == 0){
        wx.showModal({
          title: '提示',
          content: '没有找到您想要的内容',
          showCancel: false
        })
      }else{
        this.setData({
          searchResult: result,
          showSearchResult: true
        })
      }
    }
  },

  // 隐藏搜索结果
  HideSearchResult: function(e){
    this.setData({showSearchResult: false})
  },

  /**
   * 页面的初始数据
   */
  data: {
    range:[
      {name: 'name', value: '课程'},
      {name: 'coach', value: '教练'}
    ],
    pickerValue: '课程',
    name: 'name',
    inputValue: '',
    showSearchResult: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.LoadCoursesData(false);
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
    wx.showLoading({
      title: '刷新中...',
    })
    this.LoadCoursesData(true);
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