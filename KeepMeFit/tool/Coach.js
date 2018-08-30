var Net = require('./Net.js')
var net = new Net();

class Coach{
  
  /**
   * 创建新的课程
   * 传入课程数据
   * 将课程数据绑定教师信息
   * 数据保存至数据库
   * 创建完成后调用回调函数
  */
  CreateNewCourse(newCourse, cb){
    // 将新课程绑定好教练数据
    var userInfo = wx.getStorageSync('userInfo');
    newCourse.coachAvatar = userInfo.avatarUrl;
    newCourse.coach = userInfo.name;
    newCourse.coachId = userInfo.coachId;
    newCourse.phone = userInfo.phone;
    newCourse.wechat = userInfo.wechat;
    newCourse.leftNum = newCourse.totalNum;
    newCourse.studentList = [];
    // 将数据存至网络数据库和更新本地缓存
    net.PostData('CreateNewCourse', newCourse, (data)=>{
      newCourse._id = data._id;
      var courses = wx.getStorageSync('courses');
      if(!courses) courses = [] ;
      courses.push(newCourse);
      wx.setStorage({
        key: 'courses',
        data: courses,
        success: () => {
          if(cb){ cb() }
        }
      })
    })
  }
  /**
   * 通过使用教练的coachId来向数据库获取当前教练的课程
   * 如果refresh为true的话，从服务器上获取数据
   * 否则，使用本地缓存
  */
  GetCourses(cb, refresh = false){
    if(refresh){
      var me = wx.getStorageSync('userInfo');
      net.GetData('GetCoachCourse', {coachId: me.coachId}, (data)=>{
        if(data.tag){
          var courses = data.result;
          wx.setStorage({
            key: 'courses',
            data: courses,
          })
          if(cb) { cb(courses); }
        }else{
          wx.hideLoading();
          wx.showToast({
            title: '没找着您的课程~',
            icon: 'none'
          })
        }
      },true)
    }else{
      wx.getStorage({
        key: 'courses',
        success: function(res) {
          if(cb) cb(res.data);
        },
      })
    }
  }
  /**
   * 通过课程的id来获取特定的课程数据
   * PS: 现在使用_id，等服务器搭建起来后
   * 使用的是数据本身的 _id
  */
  GetCourseById(_id){
    var courses = wx.getStorageSync('courses');
    var course = courses.filter(value => {
      return value._id == _id;
    });
    return course[0];
  }
  /**
   * 修改课程信息
   * 1. 上传数据库
   * 2. 更新本地
   * 3. 执行回调
  */
  ModifyCourse(courseInfo, cb){
    var _id = courseInfo._id;
    var courses = wx.getStorageSync('courses');
    var index = courses.findIndex(value => {
      return value._id == _id;
    })
    courses[index] = courseInfo;
    wx.setStorage({
      key: 'courses',
      data: courses,
      success: () =>{
        if(cb){ cb(); }
      }
    })
  }
}

module.exports = Coach;