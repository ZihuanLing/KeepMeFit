var OpenID = require('./OpenId');
var openid = new OpenID();
var Mongo = require('./myMongoDB')
var mongo = new Mongo();

/**
 * 根据不同的参数，执行不同的行为
 */
class DoActions{
    /**
     * 获取用户的openid
     * @param {Object} params request 传入的参数
     * @param {Response} res 响应头
     */
    GetOpenId(params, res){
        var code = params.code;
        openid.GetOpenId(code, res);
    }

    /**
     * 创建新的课程
    */
   CreateNewCourse(CourseData, res){
       mongo.saveData(CourseData, "courses", res);
   }

   /**
    * 获取教练的课程
   */
    GetCoachCourse(params,res){
        var coachId = params.coachId;
        mongo.findData({coachId: coachId}, 'courses', res)
    }

    /**
     * 储存用户的个人信息
     */
    StoreUserInfo(postData, res){
        var info = postData.info, 
        user = postData.user;
        mongo.saveData(info, user, res);
    }

    /**
     * 获取用户的个人信息
     */
    GetUserInfo(params, res){
        var user = params.user;
        var target;
        if(user == 'students'){
            target = 'userId'
        }else if(user == 'coach'){
            target = 'coachId'
        }
        mongo.findData({target: params[target]}, user, res);
    }

    /**
     * 检查账号
     */
    CheckAccount(params, res){
        var account = params.account;
        mongo.findData(account, 'accounts', res);
    }

    /**
     * 获取所有课程数据
    */
   GetAllCourses(params, res){
       mongo.findData({}, 'courses', res);
   }

   /**
    * 用户参加课程
   */
  ParticipateCourse(postData, res){
      mongo.updateData({_id: postData.courseId}, 'courses', '$push', 'studentList', postData.studentInfo, res, (result)=> {
          mongo.updateData({userId: postData.studentId}, 'student', '$push', 'myCourses', postData.courseId, res);
      })
  }

  /**
   * 用户取消课程
  */
    CancelCourse(params, res){
        var courseId = params.courseId,
            userId = params.userId;
        mongo.updateData({_id: courseId}, 'courses', '$pull', 'studentList', {userId: userId}, res, result => {
            mongo.updateData({userId: userId}, 'student', '$pull', 'myCourses', courseId, res);
        })
    }
}

module.exports = DoActions;
