/*
* @Author: admin
* @Date:   2019-08-28 10:54:16
* @Last Modified by:   admin
* @Last Modified time: 2019-09-01 16:35:20
*/
/*
* @Author: admin
* @Date:   2019-08-28 10:42:55
* @Last Modified by:   admin
* @Last Modified time: 2019-08-28 10:53:48
*/
const mongoose =require("mongoose");
const Schema=mongoose.Schema;

const md5 = require('../config/md5.js');
const defaultPassword = md5(md5("00123456") + "吴明丽"); 

const TeacherSchema=new Schema({
	_id:{
		type:String
	},
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
	join:[//老师所参于评分的比赛，存放mark表中的id值
		Schema.Types.Mixed
	],
	score:[//老师所参于评分的比赛打的比赛分数
		Schema.Types.Mixed
	],
	date:{
		type:Date,
		default:Date.now
	}
})

module.exports=Teacher=mongoose.model("teachers",TeacherSchema)