/*
* @Author: admin
* @Date:   2019-06-09 13:40:19
* @Last Modified by:   admin
* @Last Modified time: 2019-08-30 19:46:50
*/
// 引入mongoose  因为要把数据储存到mongoose里
//创建用户表模型
const mongoose =require("mongoose");
const Schema=mongoose.Schema;

const md5 = require('../config/md5.js');
const defaultPassword = md5(md5("00123456") + "吴明丽"); 

const UserSchema=new Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	password:{
		type:String,
		// required:true,
		default:defaultPassword
	},
	avatar:{
		type:String
	},
	// identity:{//4发布人
	// 	type:Schema.Types.ObjectId,
	// 	ref:'identitys'
	// },
	date:{
		type:Date,
		default:Date.now
	}
})

module.exports=User=mongoose.model("users",UserSchema)