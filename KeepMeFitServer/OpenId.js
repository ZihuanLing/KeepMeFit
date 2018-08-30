//https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code

//获取用户的唯一标识 openID
var request = require('request');
var config = require('./config')

class OpenId{
	/**
	 * 
	 * @param {string} code 用户login时官方返回的code
	 * @param {Response} res 浏览器的response
	 */
	GetOpenId(code, res){
		var url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+
			config.appId+'&secret='+config.appSecret+
			'&js_code='+code+'&grant_type=authorization_code';
		request(url, (err, response, data) => {
			if(data['errcode'] || err ){ 
				// 获取openid失败
				console.log('>>> get openid failed, errMsg -> ')
				console.log(err.message);
				res.send({
					tag: false,
					errMsg: "openid获取失败，请重试"
				})
			}else{
				var tempData = JSON.parse(data)
				var openid = tempData['openid'];
				// 返回用户的openid
				res.send({tag: true, openid: openid})
				res.end();
			}
		})
	}
}

module.exports = OpenId;

//https://api.weixin.qq.com/sns/jscode2session?appid=wx984fef6e59d93aa6&secret=6b49ff8d1bdac640c20af0063233f662NaN013p2bD11zLJYN1R2UA11JymD11p2bDS&grant_type=authorization_code