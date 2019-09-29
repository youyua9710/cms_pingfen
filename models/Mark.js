/*
* @Author: admin
* @Date:   2019-08-04 14:02:52
* @Last Modified by:   admin
* @Last Modified time: 2019-09-04 11:29:01
*/
const mongoose =require("mongoose");
const Schema=mongoose.Schema;
//添加某个打分活动表

const MarkSchema=new Schema({
	_id:{
		type:String
	},
	Mark_ID:{
		type:String
		// type: Schema.Types.ObjectId,
		// ref:'articals'
	},
	title:{//1赛事打分标题
		type:String
		//打分卡的标题指向活动赛事标题
	},	
	stuNumber:{//学生人数设置
		type:Number
	},
	teaNumber:{//3教师人数设置
		type:Number
	},
	stuList:[
		Schema.Types.Mixed
	],
	teaList:[
		Schema.Types.Mixed
	],
	inference:[//4打分标准参考 几项
		Schema.Types.Mixed
	],
	// inference:[
	// 	{
	// 		type:String
	// 	}
	// ],
	date:{//6创建时间
		type:Date,
		default:Date.now
	}
})

module.exports=Mark=mongoose.model("marks",MarkSchema)