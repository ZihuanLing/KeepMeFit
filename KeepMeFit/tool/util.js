var Net = require('./Net.js')
var net = new Net();

class Util{
  /**
   * 通过对比数据库校验用户的账号密码
   * 并返回校验结果
   * 仅教练登录时需要使用账号密码
   * 并且校验
  */
  CheckUser(info = {}, cb){
    var state = true, isInfoComplete = true;
    net.GetData('CheckAccount', {account: info}, (data) => {
      if(data.tag){
        // 账号存在登录成功
        // 获取用户的openid 检查用户数据是否存在
        this.GetOpenId((openid)=> {
          net.GetData('GetUserInfo', {user: 'coach', coachId: openid}, (data) => {
            var userInfo;
            if(data.tag){
              // 用户数据存在，说明用户信息完整
              userInfo = data.result[0];
            }else{
              // 用户信息不完整
              isInfoComplete = false;
              userInfo = wx.getStorageSync('userInfo');
              userInfo.coachId = openid;
              // net.GetData('UpdateAccount', {coachId: openid});
            }
            wx.setStorage({
              key: 'userInfo',
              data: userInfo,
            });
            if(cb) cb({state: state, isInfoComplete: isInfoComplete});
            else wx.hideLoading();
          }, true)
        })
      }else{
        // 登录不成功
        state = false;
        if (cb) { cb({ state: state }) }
        else{ wx.hideLoading(); }
      }
    })
  }
  /**
   * 获取用户的openid
   * 通过回调函数传回
  */
  GetOpenId(cb){
    wx.login({
      success: res => {
        var code = res.code;
        net.GetData('GetOpenId', {code: code}, (data)=>{
          var openid = data.openid;
          if(cb){ cb(openid); }
        })
      },
      fail: res => {
        wx.showModal({
          title: '登陆失败',
          content: '请稍后重试',
        })
      }
    })
  }
  /**
   * 用户初次登陆后将个人信息上传到服务器储存起来
  */
  UploadInfo(info, user='student', cb){
    net.PostData('StoreUserInfo', {info: info, user:user}, (data) => {
      if(cb) cb(data);
    })
  }
  /**
   * 从服务器中获取所有的课程数据
  */
  GetAllCoursesData(cb){
    net.GetData('GetAllCourses',{}, data => {
      if(data.tag){
        wx.setStorage({
          key: 'courses',
          data: data.result,
        })
        if (cb) cb(data); 
      }
      else{
        wx.showToast({
          title: '找不到课程数据~',
          icon: 'none'
        })
      }
    }, true)
  }
}

module.exports = Util;