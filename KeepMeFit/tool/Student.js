var Util = require('./util.js');
var Net = require('./Net.js')
var util = new Util(), net = new Net();

class Student{
  /**
   * 登录
   * 向服务端获取openid
   * 或者从服务段返回个人信息
  */
  LogMeIn(userInfo, cb){
    // 登录属于服务端部分，先不做
    var userInfo = userInfo;
    userInfo.myCourses = [];
    util.GetOpenId((openid) => {
      // 通过openid向服务器获取用户数据
      // 如果用户已登陆过，则返回用户数据
      // 否则不返回目标数据
      var result = {loginState: true}
      net.GetData('GetUserInfo',{user: "student", openid: openid}, (data)=>{
        if(data.tag){
          userInfo = data.result[0];
          result.isInfoComplete = true;
        }else{
          // 用户第一次登陆
          userInfo.userId = openid;
          result.isInfoComplete = false;
        }
        wx.setStorage({
          key: 'userInfo',
          data: userInfo,
        })
        if(cb){ cb(result); }
      }, true);
    })
  }
  /**
   * 预约参加一项课程
  */
  ParticipateCourse(id, cb){
    var userInfo = wx.getStorageSync('userInfo');
    var myCourses = userInfo.myCourses;
    var index = myCourses.findIndex(value => {return value == id});
    if(index == -1){
      // 未预约过该课程，可以预约
      var courses = wx.getStorageSync('courses');
      var courseIndex = courses.findIndex(value => {return value._id == id});
      var studentInfo = {
        name: userInfo.name,
        phone: userInfo.phone,
        userId: userInfo.userId,
        avatar: userInfo.avatarUrl
      };
      // 更新服务器上的数据
      net.PostData('ParticipateCourse', {studentInfo: studentInfo, courseId: id, studentId: userInfo.userId}, data => {
        // 报名成功，更新本地缓存
        courses[courseIndex].studentList.push(studentInfo);
        userInfo.myCourses.push(id)
        wx.setStorage({
          key: 'userInfo',
          data: userInfo,
        })
        wx.setStorage({
          key: 'courses',
          data: courses,
        })
        wx.showToast({
          title: '预约成功',
        });
        if(cb) cb(data);
        wx.hideLoading();
      })
    }
    else{
      // 用户已经参加过了该课程
      wx.hideLoading();
      wx.showModal({
        title: '预约失败',
        content: '您已经是该课程的学生了',
        showCancel: false
      })
    }
  }

  /**
   * 取消一个课程的报名
  */
  CancelCourse(id, cb){
    var userInfo = wx.getStorageSync('userInfo');
    var userId = userInfo.userId;
    net.GetData('CancelCourse', {courseId: id, userId: userId}, result => {
      console.log(result);
      // 删除个人课程列表中对应的课程
      var index = userInfo.myCourses.findIndex(value => {
        return value == id;
      })
      userInfo.myCourses.splice(index, 1);
      wx.setStorage({
        key: 'userInfo',
        data: userInfo,
      })
      var courses = wx.getStorageSync('courses');
      // 将学生信息从对应的课程学生列表中删去
      index = courses.findIndex(value => {return value._id == id})
      var idx2 = courses[index].studentList.findIndex(value => {return value.userId == userId});
      courses[index].studentList.splice(idx2, 1);
      wx.setStorage({
        key: 'courses',
        data: courses,
      })
      if(cb) cb();
      else{wx.hideLoading();}
    })
  }
}

module.exports = Student;