/*
* @Author: admin
* @Date:   2019-08-10 16:26:08
* @Last Modified by:   admin
* @Last Modified time: 2019-08-11 00:18:56
*/
const mongoose =require("mongoose");
const Schema=mongoose.Schema;


const CategorySchema=new Schema({
	title:{
		type:String,
		required:true
	},
	slug:{
		type:String,
		required:true
	},
	date:{
		type:Date,
		default:Date.now
	}
})

module.exports=Category=mongoose.model("categorys",CategorySchema)