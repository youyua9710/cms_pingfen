/*
* @Author: admin
* @Date:   2019-08-28 10:42:55
* @Last Modified by:   admin
* @Last Modified time: 2019-09-01 16:35:05
*/
const mongoose =require("mongoose");
const Schema=mongoose.Schema;
const md5 = require('../config/md5.js');
const defaultPassword = md5(md5("00123456") + "吴明丽"); 
	// let num="0";
 //    let defaultID=()=>{
 //      num++
 //      return num.toString().padStart(10,'0');
 //    }



const StudentSchema=new Schema({
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
	level:{
		type: Schema.Types.ObjectId, 
		ref: 'grades' 
	},
	join:[
	//学生报名参加的比赛，存放每一个比赛表中的id值
		{ type: Schema.Types.ObjectId, ref: 'Mark' }
	],
	score:[//存放每一个学生参加比赛所获得的分数
		Schema.Types.Mixed
	],
	// schoolId:{
	// 	type:Number
	// },
	date:{
		type:Date,
		default:Date.now
	}
})
	// console.log("Student.count",Student.count())

module.exports=Student=mongoose.model("students",StudentSchema)