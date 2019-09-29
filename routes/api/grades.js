/*
* @Author: admin
* @Date:   2019-08-28 11:47:41
* @Last Modified by:   admin
* @Last Modified time: 2019-08-30 19:36:03
*/
const express = require("express");
const router = express.Router();
const passport=require("passport");

const Grade = require("../../models/Grade.js");
//api/grades/test
router.get('/test',(req,res)=>{
	res.json({msg:'这是grades的test'})
})

// $route  Post api/grades/add
// @desc  点击增加时  创建信息接口 存储到数据库
// @access  private
router.post("/add",passport.authenticate("jwt",{session:false}),(req,res)=>{
	// const newUser = new User({name: req.body.name, email: req.body.email });
	console.log("req",req)
	const gradeFields={};
	//如果有请求数据类型  将请求数据赋值给gradeFields
	if(req.body.grade) gradeFields.grade=req.body.grade;
	console.log("gradeFields",gradeFields)
	
	//拿到这些数据之后 放入数据库表模型中，保存
	new Grade(gradeFields).save().then(grade=>{
		res.json(grade)
	})
})

// $route  Post api/grades
// @desc  在资金流水页面时可以看到所有数据 获取所有信息
// @access  private
router.get("/",(req,res)=>{
	Grade.find().then(grade=>{
		if(!grade){
			return res.status(404).json('没有任何内容');
		}
		res.json(grade);
	}).catch(err=>res.status(404).json(err))
})

// $route  Post api/grades/id
// @desc  编辑时查看 获取到单个信息  点击某一个时给发一个id进去
// @access  private
router.get("/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
	Grade.findOne({_id:req.params.id}).then(grade=>{
		if(!grade){
			return res.status(404).json('没有任何内容');
		}
		res.json(grade);
	}).catch(err=>res.status(404).json(err))
})
// $route  Post api/grades/edit/:id
// @desc  确定编辑时 更新到单个信息  点击某一个时给发一个id进去
// @access  private
router.post("/edit/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
	// const newUser = new User({name: req.body.name, email: req.body.email });
	const gradeFields={};
	//如果有请求数据类型  将请求数据赋值给gradeFields
	if(req.body.title) gradeFields.title=req.body.title;
	if(req.body.slug) gradeFields.slug=req.body.slug;

	//拿到这些数据之后 去grade模型数据表中查找
	Grade.findOneAndUpdate(
		{_id:req.params.id},//拿到
		{$set:gradeFields},//设置 更新
		{new:true} //定义  是一个新的东西
	).then(grade=>res.json(grade))
})

// $route  Post api/grades/delete/:id
// @desc  点击删除信息接口访问到api/grades/delete/:id
// @access  private
router.delete("/delete/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
	Grade.findOneAndRemove({_id:req.params.id}).then(grade=>{
		grade.save().then(grade=>res.json(grade))
		//删完之后保存，然后重新发送更新category数据表
	}).catch(err=>res.status(400).json("删除失败1"))
})
module.exports = router;