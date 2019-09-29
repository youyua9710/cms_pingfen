/*
* @Author: admin
* @Date:   2019-08-28 11:46:20
* @Last Modified by:   admin
* @Last Modified time: 2019-08-28 11:47:22
*/

const mongoose =require("mongoose");
const Schema=mongoose.Schema;
const GradeSchema=new Schema({
	grade:{
		type:String,
		required:true
	},
	date:{
		type:Date,
		default:Date.now
	}
})
module.exports=Grade=mongoose.model("grades",GradeSchema)