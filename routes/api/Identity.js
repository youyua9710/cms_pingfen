/*
* @Author: admin
* @Date:   2019-08-18 20:28:17
* @Last Modified by:   admin
* @Last Modified time: 2019-08-29 23:51:57
*/
/*
* @Author: admin
* @Date:   2019-08-04 14:10:51
* @Last Modified by:   admin
* @Last Modified time: 2019-08-18 12:07:30
*/
const express = require("express");
const router = express.Router();
const passport=require("passport");

const Identitys = require("../../models/Identitys.js");
//api/identitys/test
router.get('/test',(req,res)=>{
	res.json({msg:'这是identitys的test'})
})

// $route  Post api/identityss/add
// @desc  点击增加时  创建信息接口 存储到数据库
// @access  private
router.post("/add",passport.authenticate("jwt",{session:false}),(req,res)=>{
	console.log("req.body",req.body)
	const identitysFields={};
	if(req.body.identity) identitysFields.identity=req.body.identity;
	console.log("identitysFields",identitysFields)
	
	new Identitys(identitysFields).save().then(identitys=>{
		res.json(identitys)
	})
})

// $route  Post api/identityss
// @desc  在资金流水页面时可以看到所有数据 获取所有信息
// @access  private
router.get("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
	Identitys.find().then(identitys=>{
		if(!identitys){
			return res.status(404).json('没有任何内容');
		}
		res.json(identitys);
	}).catch(err=>res.status(404).json(err))
})

// $route  Post api/identityss/id
// @desc  编辑时查看 获取到单个信息  点击某一个时给发一个id进去
// @access  private
router.get("/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
	Identitys.findOne({_id:req.params.id}).then(identitys=>{
		if(!identitys){
			return res.status(404).json('没有任何内容');
		}
		res.json(identitys);
	}).catch(err=>res.status(404).json(err))
})
// $route  Post api/identityss/edit/:id
// @desc  确定编辑时 更新到单个信息  点击某一个时给发一个id进去
// @access  private
router.post("/edit/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
	// const newUser = new User({name: req.body.name, email: req.body.email });
	const identitysFields={};
	if(req.body.title) identitysFields.title=req.body.title;
	if(req.body.slug) identitysFields.slug=req.body.slug;

	Identitys.findOneAndUpdate(
		{_id:req.params.id},//拿到
		{$set:identitysFields},//设置 更新
		{new:true} //定义  是一个新的东西
	).then(identitys=>res.json(identitys))
})

// $route  Post api/identityss/delete/:id
// @desc  点击删除信息接口访问到api/identityss/delete/:id
// @access  private
router.delete("/delete/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
	Identitys.findOneAndRemove({_id:req.params.id}).then(identitys=>{
		identitys.save().then(identitys=>res.json(identitys))
		//删完之后保存，然后重新发送更新identitys数据表
	}).catch(err=>res.status(400).json("删除失败1"))
})
module.exports = router;