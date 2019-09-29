/*
* @Author: admin
* @Date:   2019-08-31 19:19:00
* @Last Modified by:   admin
* @Last Modified time: 2019-08-31 19:19:03
*/
class BaseModel{
	constructor(data,message){//data是对象类型 message 是字符串类型
		if(typeof data==="string"){//如果第一个就传了字符串，就把对象data不要了
			this.message=data
			data=null
			message=null
		}
		if(data){//对象
			this.data=data
		}
		if(message){
			this.message=message
		}
	}
}
//建模型
class SuccessModel extends BaseModel{//继承baseModel
	constructor(data,message){
		super(data,message)//执行父类的构造代码
		this.errno=0
	}
}

class ErrorModel extends BaseModel{
	constructor(data,message){
		super(data,message)//执行父类的构造代码 把data和message传过去
		this.errno=-1
	}
}

module.exports={
	SuccessModel,
	ErrorModel
}