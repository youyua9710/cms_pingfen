/*
 * @Author: admin
 * @Date:   2019-08-30 10:51:27
 * @Last Modified by:   admin
 * @Last Modified time: 2019-09-01 17:10:39
 */
/*
 * @Author: admin
 * @Date:   2019-08-29 23:29:59
 * @Last Modified by:   admin
 * @Last Modified time: 2019-08-30 10:19:14
 */

// @login &register
const express = require("express");
const gravatar = require("gravatar");
const jwt = require('jsonwebtoken')
const router = express.Router();
// const db=require("../../config/db.js");
const md5 = require('../../config/md5.js');
const keys = require('../../config/db.js');
const Teacher = require("../../models/Teacher.js");
const Identitys = require("../../models/Identitys.js");
const Grade = require("../../models/Grade.js");
const passport = require("passport");
const { SuccessModel, ErrorModel } = require('../../resModel/resModel.js')

// $route  GET api/teachers/test
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
    console.log("req", req)
    Teacher.find().populate({ path: 'identity' }).then(user => {
        if (!user) {
            return res.status(404).json('没有任何内容');
        }
        res.json(user);
    }).catch(err => res.status(404).json(err))
    console.log("res", res)

})
// $route  Post api/teachers/add
// @desc  点击增加时  创建信息接口 存储到数据库
// @access  private
var allCount;
router.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
    const userFields = {};
    //如果有请求数据类型  将请求数据赋值给userFields
    // if(req.body.category) userFields.category=req.body.category;
    Teacher.count().then(count => {
        allCount = count.toString();
        console.log("count", count)
        console.log("count.padStart", allCount.padStart(10, '0'))
    })
    Teacher.find({ email: req.body.email }).then(user => {
        if (user == false) { // []==false   ![]==false
            userFields._id=allCount.padStart(10, '1000000000');
            if (req.body.name) userFields.name = req.body.name;
            if (req.body.email) userFields.email = req.body.email;
            console.log("userFields", userFields)
            new Teacher(userFields).save().then(user => {
                res.json(new SuccessModel("成功添加"))
            })
        } else {
            res.json(new ErrorModel("添加失败,邮箱已存在"));
        }
    })
})

// $route  Post api/teachers/register
// @desc  返回的请求的json数据
// @access  public
router.post("/register", (req, res) => {
    // 查询数据库当中是否拥有邮箱
    // Grade.findOne({ grade: req.body.level }).then(level=>{
    Teacher.count().then(count => {
        allCount = count.toString();
        console.log("count", count)
        console.log("count.padStart", allCount.padStart(10, '0'))
    })
    Teacher.findOne({ email: req.body.email })
        // .populate({ path: "level" })
        .then(user => {
            if (user) {
                res.json(new ErrorModel("邮箱已存在"));
            } else {
                Grade.findOne({ grade: req.body.level }).then(level => {
                    const avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' })
                    const password = md5(md5(req.body.password) + "吴明丽")
                    const newTeacher = new Teacher({
                        _id:allCount.padStart(10, '1000000000'),
                        name: req.body.name,
                        email: req.body.email,
                        avatar,
                        password,
                        // identity: req.body.identity
                        // level: level_id
                    });
                    newTeacher.save() //存储进去
                        .then(user => res.json(new SuccessModel("成功注册")))
                        .catch(err => console.log(err));
                })
            }
        })
})
// })
// $route  Post api/teachers/login
// @desc  返回的token  jwt password
// @access  public
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = md5(md5(req.body.password) + "吴明丽"); //把密码md5格式一下
    //查询数据库
    Teacher.findOne({ email })
        // .populate({ path: "level" })
        .then(Teacher => {
            if (!Teacher) { //用户bu存在
                return res.status(404).json("用户邮箱并不存在")
            }
            if (Teacher.password == password) { //如果用户密码匹配
                // rightTeacher=Teacher;
                const rule = {
                    id: Teacher.id,
                    name: Teacher.name,
                    avatar: Teacher.avatar,
                    identity: "teacher"
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
// $route  GET api/teachers/current
// @desc  返回的 当前用户信息 current Teacher
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
    Teacher.findOneAndRemove({ _id: req.params.id }).then(user => {
        user.save().then(user => res.json(new SuccessModel("删除成功")))
        //删完之后保存，然后重新发送更新artical数据表
    }).catch(err => res.status(400).json(new ErrorModel("删除失败")))
})
module.exports = router;