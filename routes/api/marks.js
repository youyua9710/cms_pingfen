/*
 * @Author: admin
 * @Date:   2019-08-11 00:44:19
 * @Last Modified by:   admin
 * @Last Modified time: 2019-09-04 19:41:18
 */
const express = require("express");
const router = express.Router();
const passport = require("passport");

const Mark = require("../../models/Mark.js");
const Artical = require("../../models/Artical.js");
const Student = require("../../models/Student.js");
const Teacher = require("../../models/Teacher.js");
const { SuccessModel, ErrorModel } = require('../../resModel/resModel.js')

//api/marks/test
router.get('/test', (req, res) => {
    res.json({ msg: '这是mark的test' })
})
var allCount;

// $route  Post api/marks/add/:id是创建文章表对应的每一个赛事表
// @desc  点击增加时  创建信息接口 存储到数据库
//在未创建时创建赛事表，如果创建了要去/：id查看赛事表
router.post("/add/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    console.log(" 保存赛事后提交的增加赛事接口的req.body", req.body)

    // console.log("artical的id", req.params.id);

    Mark.count().then(count => {
        allCount = count.toString();
        // console.log("allCount", allCount)
    })
    Mark.find({ Mark_ID: req.params.id }).then(mark => {
        if (mark == false) { // []==false   ![]==false
            Artical.findOneAndUpdate({ _id: req.params.id }, { $set: { published: true } })
            .then(artical => {
                var inferencesArray =[];
                // console.log("oneInference",oneInference)
            	console.log("创建时的artical",artical);
                const articalFields = {};
                articalFields._id = allCount.padStart(5, '10000')
                articalFields.Mark_ID = req.params.id;
                articalFields.status = 1;
                articalFields.title = artical.title;
                articalFields.stuNumber = req.body.stuNumber;
                articalFields.teaNumber = req.body.teaNumber;
                if (req.body.stuList) articalFields.stuList = req.body.stuList;
                if (req.body.teaList) articalFields.teaList = req.body.teaList;
                if (req.body.inference) articalFields.inference = req.body.inference;
                // if (req.body.forms.comments) articalFields.comments = req.body.forms.comments;
                // //拿到这些数据之后 放入数据库表模型中，保存
                console.log("增加赛事中的articalFields", articalFields)
                new Mark(articalFields)
                    // .populate({ path: 'Mark_ID' })
                    .populate({ path: 'stuList' })
                    .populate({ path: 'teaList' })
                    .save().then(mark => {
                        // console.log("增加赛事中的mark", mark)
                        res.json(new SuccessModel(mark, "创建赛事成功"))
                    })
            })
        } else {
            res.json(new ErrorModel("该赛事已创建过了"));
        }
    })

})

// $route  Post api/marks
// @desc  在资金流水页面时可以看到所有数据 获取所有信息
// @access  private
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    Mark.find().then(mark => {
        if (!mark) {
            return res.status(404).json('没有任何内容');
        }
        res.json(mark);
    }).catch(err => res.status(404).json(err))
})

// $route  Post api/marks/id
// @desc  编辑时查看 获取到单个信息  点击某一个时给发一个id进去
// @access  private
router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Mark.findOne({ Mark_ID: req.params.id }).then(mark => {
    	// console.log("进入赛事中获取的mark",mark);
        if (!mark) {
            return res.status(404).json('没有任何内容');
        }
        res.json(mark);
    }).catch(err => res.status(404).json(err))
})


// $route  Post api/marks/edit/:id
// @desc  确定编辑时 更新到单个信息  点击某一个时给发一个id进去
// @access  private
router.post("/update/:id/addStu", passport.authenticate("jwt", { session: false }), (req, res) => {
    //1）首先添加学生邮箱，得确保有这个学生邮箱
    // 如果有了该学生邮箱是正确的，得确保该学生没有在该Mark赛事的stuList表里面
    //如果在了stuList表里面，返回错误。
    //如果没有在stuList表里面，添加
    //2）如果没有这个邮箱，请确认学生该邮箱
    console.log("req.body11111：",req.body);
    Student.findOne({ email: req.body.email }).then(student => {//1)确保有这个学生邮箱
        if (student) {//2)找到该学生之后，把这三种信息存储到mark的stuList里
            var stuFileds = {
                _id: student._id,
                email: student.email,
                name: student.name
            }
            console.log("student",student)
            Mark.find({ "Mark_ID": req.params.id, "stuList": { $elemMatch: { "email": stuFileds.email } } })
            // Mark.findOne({ "Mark_ID": req.params.id })
                .then(mark1 => {
                    console.log("mark111",mark1)
                	console.log("mark1.stuList",mark1.stuList)
                    console.log("stuFileds11",stuFileds)
                    if (mark1 == false) {
                    // if (mark1) {//2）找得到email的学生就是已经添加了!mark就是里面没有该学生再
                        console.log(22222)
                        Mark.findOneAndUpdate(//这里只是用来添加到数组的数据
                            { Mark_ID: req.params.id }, 
                            // { Mark_ID: req.body.addMark._id }, 
                            { $push: { "stuList": stuFileds } },
                            {new:true}
                        )
                        // Mark.find({ Mark_ID: req.body.addMark._id })
                        .populate({ path: 'stuList' })
                        .then(mark2 => {
                            console.log("stuFileds22",stuFileds)
            				console.log("mark222",mark2)
                            res.json(new SuccessModel(mark1, "为该赛事添加学生成功"))
                        })

                    } //如果在mark表中没有找到该学生邮箱
                    else {
                        // console.log("已存在的mark？？",mark)
                        return res.json(new ErrorModel(mark,"该赛事表中已存在该学生"));
                    }
                })
        } else { //2）如果没有这个邮箱，请确认学生该邮箱
            return res.json(new ErrorModel("请确认该学生邮箱"));
        }
    })
})
router.get("/update/allStu/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    // Mark.findOne({ "Mark_ID": req.params.id })
    console.log(req.params.id)
    Mark.findOne({ Mark_ID: req.params.id }).then(mark => {
            console.log("mark",mark)
            res.json(mark);
        })
})
router.get("/update/allTea/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    // Mark.findOne({ "Mark_ID": req.params.id })
    console.log(req.params.id)
    Mark.findOne({ Mark_ID: req.params.id }).then(mark => {
            console.log("mark",mark)
            res.json(mark);
        })
})
// $route  Post api/marks/edit/:id
// @desc  确定编辑时 更新到单个信息  点击某一个时给发一个id进去
// @access  private
router.post("/update/:id/addTea", passport.authenticate("jwt", { session: false }), (req, res) => {
    console.log("req.body22222：",req.body);
    Teacher.findOne({ email: req.body.email }).then(teacher => {//1)确保有这个学生邮箱
        if (teacher) {//2)找到该学生之后，把这三种信息存储到mark的stuList里
            var teaFileds = {
                _id: teacher._id,
                email: teacher.email,
                name: teacher.name
            }
            console.log("teacher",teacher)
            Mark.find({ "Mark_ID": req.params.id, "teaList": { $elemMatch: { "email": teaFileds.email } } })
            // Mark.findOne({ "Mark_ID": req.params.id })
                .then(mark1 => {
                    console.log("mark111",mark1)
                    console.log("mark1.teaList",mark1.teaList)
                    console.log("teaFileds",teaFileds)
                    if (mark1 == false) {
                    // if (mark1) {//2）找得到email的学生就是已经添加了!mark就是里面没有该学生再
                        console.log(22222)
                        Mark.findOneAndUpdate(//这里只是用来添加到数组的数据
                            { Mark_ID: req.params.id }, 
                            { $push: { "teaList": teaFileds } },
                            {new:true}
                        )
                        .populate({ path: 'teaList' })
                        .then(mark2 => {
                            console.log("teaFileds3333333",teaFileds)
                            console.log("mark333333",mark2)
                            res.json(new SuccessModel(mark1, "为该赛事添加评委老师成功"))
                        })

                    } //如果在mark表中没有找到该学生邮箱
                    else {
                        // console.log("已存在的mark？？",mark)
                        return res.json(new ErrorModel(mark,"该赛事表中已存在该老师"));
                    }
                })
        } else { //2）如果没有这个邮箱，请确认学生该邮箱
            return res.json(new ErrorModel("请确认该老师邮箱"));
        }
    })
})
// $route  Post api/marks/edit/:id
// @desc  确定编辑时 更新到单个信息  点击某一个时给发一个id进去
// @access  private
router.post("/edit/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    console.log("req.body",req.body)
    const markFields={};
    //如果有请求数据类型  将请求数据赋值给markFields
    if (req.body.title) markFields.title = req.body.title;
    if (req.body.stuNumber) markFields.stuNumber = req.body.stuNumber;
    if (req.body.teaNumber) markFields.teaNumber = req.body.teaNumber;
    if (req.body.stuList) markFields.stuList = req.body.stuList;
    if (req.body.teaList) markFields.teaList = req.body.teaList;
    if (req.body.inference) markFields.inference = req.body.inference;

    console.log("markFields",markFields)
    //拿到这些数据之后 去mark模型数据表中查找
    Mark.findOneAndUpdate(
    	{Mark_ID: req.params.id},//拿到
    	{$set:markFields},//设置 更新
    	{new:true} //定义  是一个新的东西
    ).then(mark=>res.json(new SuccessModel(mark, "赛事信息编辑成功")))
    //因为创建赛事表的时候已经有了空表了，进来之后添加就是编辑该表了
    
})





// $route  Post api/marks/delete/:id
// @desc  点击删除信息接口访问到api/marks/delete/:id
// @access  private
router.delete("/delete/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Mark.findOneAndRemove({ _id: req.params.id }).then(mark => {
        mark.save().then(mark => res.json(mark))
        //删完之后保存，然后重新发送更新mark数据表
    }).catch(err => res.status(400).json("删除失败1"))
})
module.exports = router;