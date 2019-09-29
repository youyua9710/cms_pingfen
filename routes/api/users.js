/*
 * @Author: admin
 * @Date:   2019-06-09 13:29:32
 * @Last Modified by:   admin
 * @Last Modified time: 2019-08-31 15:36:04
 */
// @login &register
const express = require("express");
const gravatar = require("gravatar");
const jwt = require('jsonwebtoken')
const router = express.Router();
// const db=require("../../config/db.js");
const md5 = require('../../config/md5.js');
const keys = require('../../config/db.js');
const User = require("../../models/User.js");
const Identitys = require("../../models/Identitys.js");
const passport = require("passport");

// $route  GET api/users/test
// @desc  返回的请求的json数据
// @access  public 公开的接口，token是私有接口
router.get("/test", (req, res) => {
    res.json({
        "msg": "这里是：api/users/test"
    })
});
// $route  Post api/identitys
// @desc  在资金流水页面时可以看到所有数据 获取所有信息
// @access  private
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    console.log("req", req)
    User.find().populate({ path: 'identity' }).then(user => {
        if (!user) {
            return res.status(404).json('没有任何内容');
        }
        res.json(user);
    }).catch(err => res.status(404).json(err))
    console.log("res", res)

})
// $route  Post api/categorys/add
// @desc  点击增加时  创建信息接口 存储到数据库
// @access  private

router.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
    // const newUser = new User({name: req.body.name, email: req.body.email });
    const userFields = {};
    //如果有请求数据类型  将请求数据赋值给userFields
    // if(req.body.category) userFields.category=req.body.category;
    Identitys.find({ identity: req.body.forms.identity }).then(user => {
        console.log(user)
        userFields.identity = user[0]._id;
        // console.log("identity转成id之后", userFields.identity)
        console.log("req.body.forms", req.body.forms)
        console.log("userFields",userFields)
        if (req.body.forms.name) userFields.name = req.body.forms.name;
        if (req.body.forms.email) userFields.email = req.body.forms.email;
        //拿到这些数据之后 放入数据库表模型中，保存

        console.log("userFields", userFields)
        new User(userFields).populate({ path: 'identity' }).save().then(user => {
            // console.log("创建user后",user);
            res.json(user)
        })
    })
})

// $route  Post api/users/register
// @desc  返回的请求的json数据
// @access  public
router.post("/register", (req, res) => {
    // 查询数据库当中是否拥有邮箱
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                console.log("user2", user);
                res.json("邮箱已被注册");
            } 
            else { //如果没有被占用，就注册新用户
            
                //s是大小，pg是格式，mm是有一个头像 404是报错的头像
                const avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' })
                const password = md5(md5(req.body.password) + "吴明丽")
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password,
                    identity: req.body.identity
                });
                console.log("注册下的newUser：", newUser);
                console.log("注册下的newUser类型：", typeof(newUser));
                newUser.save() //存储进去
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
            }
        })
})
// $route  Post api/users/login
// @desc  返回的token  jwt password
// @access  public
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = md5(md5(req.body.password) + "吴明丽"); //把密码md5格式一下
    //查询数据库
    User.findOne({ email })
        .then(user => {
            if (!user) { //用户bu存在
                return res.status(404).json("用户邮箱并不存在")
            }
            if (user.password == password) { //如果用户密码匹配
                // rightUser=user;
                const rule = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    identity:"admin"
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
// $route  GET api/users/current
// @desc  返回的 当前用户信息 current user
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
module.exports = router;