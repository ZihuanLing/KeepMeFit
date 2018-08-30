var mongodb = require('mongodb')
var ObjectID = mongodb.ObjectID;
var MongoClient = mongodb.MongoClient;
var config = require('./config');

/**
 * 实现数据库的增删改查
 */
class MongoDB{
    constructor(database = 'KDatabase'){
        var mongoUrl = `mongodb://${config.mongoHost}:${config.mongoPort}/${database}`;
        console.log('connecting to >>> ', mongoUrl)
        MongoClient.connect(mongoUrl, (err, db) => {
            if(err){ throw err; }
            this.database = db;
            this.db = db.db(database);
            console.log('>> database connected')
        })
    }

    /**
     * 存储数据
     * data -> 需要存储的数据
     * clt -> 将数据存储到哪一个集合里面
     * response -> 通过response返回数据
     * callback -> 回调函数，如果回调函数存在，那么传入的response不返回内容
    */
    saveData(data, clt, response, callback = null) {
        this.db.collection(clt).insertMany([data], (err, res) => {
            if (err || res.result.n == 0) {
                throw err;
                response.send({
                    tag: false,
                    errMsg: '数据库发生错误，存储数据失败',
                    err: err ? err : ''
                })
                return;
            }
            if (callback) { callback(res); }
            else {
                response.send({
                    tag: true,
                    _id: res.ops[0]._id,
                })
            }
        })
    }

    /**
     * 查找数据
     * targetStr -> 查找目标
     * clt -> 集合
     * response -> 响应
     * callback -> 回调 | 参数：查找到的数据列表，若无则空
     * 如果没有回调，直接通过response返回找到的数据
    */
    findData(targetStr, clt, response, callback = null) {
        if (targetStr._id) { targetStr._id = ObjectID(targetStr._id) }
        this.db.collection(clt).find(targetStr).toArray((err, result) => {
            if (err || result.length == 0) {
                response.send({
                    tag: false,
                    errMsg: '没有找到你需要的数据'
                })
                return;
            }
            if (callback) {
                callback(result);
            } else {
                response.send({
                    tag: true,
                    result: result
                })
            }
        })
    }

    /**
     * 删除clt集合里面的一条数据
     */
    delData(targetStr, clt, response, callback = null) {
        if (targetStr._id) { targetStr._id = ObjectID(targetStr._id); }
        this.db.collection(clt).deleteOne(targetStr, (err, obj) => {
            if (err || obj.result.n == 0) {
                response.send({
                    tag: false,
                    errMsg: '删除错误，数据不存在'
                })
                return;
            }
            if (callback) {
                callback(obj.result);
            } else {
                response.send({
                    tag: true
                })
            }
        })
    }

    /**
     * 更改数据库里面的数据
     * targetStr - 要更改的目标
     * clt - 集合
     * opt - 更新数据操作|常用：$inc
     * filed - 需要更新的域
     * data - 需要更新的具体数据
     * response - 网络回应
     * callback - 回调
    */
    updateData(targetStr, clt, opt = "", filed = "", data, response, callback = null) {
        var updateStr = {};
        var newData = {}
        newData[filed] = data
        updateStr[opt] = newData;
        if (targetStr._id) { targetStr._id = ObjectID(targetStr._id); }
        console.log("update string: >>> \n", updateStr)
        this.db.collection(clt).update(targetStr, updateStr, (err, res) => {
            if (err || res.result.nModified == 0) {
                response.send({
                    tag: false,
                    errMsg: '修改失败，无匹配数据',
                    err: err
                })
                return;
            }
            if (callback) { callback(res.result); }
            else {
                response.send({ tag: true, result: res.result });
            }
        })
    }

    /**
     * 关闭数据库连接
    */
    close() {
        this.database.close();
    }
}

module.exports = MongoDB;
