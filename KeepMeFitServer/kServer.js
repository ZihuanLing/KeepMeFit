var config = require('./config');
var express = require('express');
var app = express();
var DoActions = require('./DoActions')
var Excute = new DoActions();

app.get('/keepMeFit', (req, res) => {
	var params = req.query;
	var action = params.action;
	console.log("Getting from " + req.ip + ' ==> ' + action);
	try {
		Excute[action](params, res);
	} catch (e) {
		console.log(">>> params \n",params)
		console.log(">>> error \n", e)
		res.send({
			tag: false,
			errMsg: "您的打开方式不对！"
		})
	}
})	

app.post('/keepMeFit', (req, res) => {
	req.on('data', (chunk)=>{
		var data = JSON.parse(chunk);
		var action = data.action;
		var postData = data.postData;
		console.log("Getting from " + req.ip + ' ==> ' + action);
		try {
			Excute[action](postData, res);
		} catch (e) {
			console.log(">>> data \n", data)
			console.log(">>> error \n", e)
			res.send({
				tag: false,
				errMsg: "您的打开方式不对！"
			})
		}
	})
})
app.listen(config.port, '0.0.0.0', (err) => {
	if (err) { return console.error(err);}
	console.log('>>> Server running...')
});