/*
* @Author: admin
* @Date:   2019-07-28 01:34:24
* @Last Modified by:   admin
* @Last Modified time: 2019-08-11 00:43:50
*/
// 本地数据库方法1
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/xueshengguanli');
// var db = mongoose.connection;
// db.once('open', function (callback) {
//     console.log("数据库成功打开");
// });
// module.exports = db;

// 本地数据库方法2
module.exports={
	mongoURI:"mongodb://localhost:27017/cms_pingfen1",
	secretOrKey:"secret"
}