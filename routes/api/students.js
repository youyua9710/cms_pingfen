/*
 * @Author: admin
 * @Date:   2019-08-29 23:29:59
 * @Last Modified by:   admin
 * @Last Modified time: 2019-09-05 08:05:23
 */

// @login &register
const express = require("express");
const gravatar = require("gravatar");
const jwt = require('jsonwebtoken')
const router = express.Router();
// const db=require("../../config/db.js");
const md5 = require('../../config/md5.js');
const keys = require('../../config/db.js');
const Student = require("../../models/Student.js");
const Identitys = require("../../models/Identitys.js");
const Grade = require("../../models/Grade.js");
const passport = require("passport");
const { SuccessModel, ErrorModel } = require('../../resModel/resModel.js')

// $route  GET api/students/test
// @desc  返回的请求的json数据
// @access  public 公开的接口，token是私有接口
router.get("/test", (req, res) => {
    res.json({
        "msg": "这里是：api/student/test"
    })
});
// $route  Post api/students
// @desc  在资金流水页面时可以看到所有数据 获取所有信息
// @access  private
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    Student.find().populate({ path: 'level' })
        .then(user => {
            if (!user) {
                return res.status(404).json('没有任何内容');

            }
            res.json(user);
        })
})

// 自增

var allCount;



// $route  Post api/students/add
// @desc  点击增加时  创建信息接口 存储到数据库
// @access  private
router.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
    // console.log("req.body", req.body)
    const userFields = {};
    Student.count().then(count => {
        allCount = count.toString();
    })
    Student.find({ email: req.body.email }).populate({ path: 'level' })
        .then(user => {
            console.log("找到的user是什么？", user);
            if (user == false) { // []==false   ![]==false
                // console.log("user2如果已经存在返回的res查看：", res);
                Grade.find({ grade: req.body.level }).then(grade => {
                    console.log("grade是什么呢?", grade);
                    // console.log("req.body.forms", req.body.forms)
                    // console.log("userFields1", userFields)
                    const avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' })
                    userFields.avatar=avatar;
                    userFields._id = allCount.padStart(10, '0');
                    if (req.body.name) userFields.name = req.body.name;
                    if (req.body.level) userFields.level = grade[0]._id;
                    if (req.body.email) userFields.email = req.body.email;

                    //拿到这些数据之后 放入数据库表模型中，保存
                    console.log("userFields2", userFields)
                    new Student(userFields).populate({ path: 'level' }).save().then(user => {
                        console.log("创建user后", user);
                        res.json(new SuccessModel("成功添加"));
                    })
                })
            } else {
                res.json(new ErrorModel("添加失败,邮箱已存在"));
            }
        })
})

// $route  Post api/students/register
// @desc  返回的请求的json数据
// @access  public
router.post("/register", (req, res) => {
    // 查询数据库当中是否拥有邮箱
    Student.count().then(count => {
        allCount = count.toString();
        console.log("count", count)
        console.log("count.padStart", allCount.padStart(10, '0'))
    })
    Student.findOne({ email: req.body.email })
        .populate({ path: "level" })
        .then(user => {
            if (user) {
                res.json(new ErrorModel("邮箱已存在"));
            } else {
                Grade.findOne({ grade: req.body.level }).then(level => {
                    console.log("level", level);
                    const avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' })
                    const password = md5(md5(req.body.password) + "吴明丽")
                    const newStudent = new Student({
                        _id: allCount.padStart(10, '0'),
                        name: req.body.name,
                        email: req.body.email,
                        avatar,
                        password,
                        level: level,
                    });
                    newStudent.save() //存储进去
                        .then(user => {
                            Student.update();
                            res.json(new SuccessModel("成功注册"));
                        })
                        .catch(err => console.log(err));
                })
            }
        })
})
// $route  Post api/students/login
// @desc  返回的token  jwt password
// @access  public
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = md5(md5(req.body.password) + "吴明丽"); //把密码md5格式一下
    //查询数据库
    Student.findOne({ email })
        // .populate({ path: "level" })
        .then(student => {
            if (!student) { //用户bu存在
                return res.status(404).json("用户邮箱并不存在")
            }
            if (student.password == password) { //如果用户密码匹配
                // rightstudent=student;
                const rule = {
                    id: student.id,
                    name: student.name,
                    avatar: student.avatar,
                    identity: "student"
                };
                // 规则，加密名字，过期时间，箭头函数
                jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                    if (err) { return res.json("jwt验证错误") };
                    res.json({
                        success: true,
                        token: 'Bearer ' + token //返回token
                    });
                });
            } else {
                return res.status(400).json("密码匹配错误")
            }

        })
})
// $route  GET api/students/current
// @desc  返回的 当前用户信息 current student
// @access  private
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    // res.json({msg:"success"})
    // res.json(req.user)
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    })
})

router.delete("/delete/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Student.findOneAndRemove({ _id: req.params.id }).then(student => {
        student.save().then(student => res.json(new SuccessModel("删除成功")))
        //删完之后保存，然后重新发送更新artical数据表
    }).catch(err => res.status(400).json(new ErrorModel("删除失败")))
})


module.exports = router;