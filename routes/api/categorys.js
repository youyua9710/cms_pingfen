/*
 * @Author: admin
 * @Date:   2019-08-04 14:10:51
 * @Last Modified by:   admin
 * @Last Modified time: 2019-09-01 17:17:43
 */
const express = require("express");
const router = express.Router();
const passport = require("passport");

const Category = require("../../models/Category.js");
const { SuccessModel, ErrorModel } = require('../../resModel/resModel.js')

//api/categorys/test
router.get('/test', (req, res) => {
    res.json({ msg: '这是category的test' })
})

// $route  Post api/categorys/add
// @desc  点击增加时  创建信息接口 存储到数据库
// @access  private
router.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
    // const newUser = new User({name: req.body.name, email: req.body.email });
    console.log("req.body", req.body)
    const categoryFields = {};
    Category.find({ title: req.body.title })
        .then(category => {
            if (category == false) {
                //如果有请求数据类型  将请求数据赋值给categoryFields
                if (req.body.title) categoryFields.title = req.body.title;
                if (req.body.slug) categoryFields.slug = req.body.slug;
                console.log("categoryFields", categoryFields)

                //拿到这些数据之后 放入数据库表模型中，保存
                new Category(categoryFields).save().then(category => {
                    res.json(new SuccessModel("成功添加类型"))
                })
            }
            else{
				res.json(new ErrorModel("添加失败,该类型已存在"));
            }
        })

})

// $route  Post api/categorys
// @desc  在资金流水页面时可以看到所有数据 获取所有信息
// @access  private
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    Category.find().then(category => {
        if (!category) {
            return res.status(404).json('没有任何内容');
        }
        res.json(category);
    }).catch(err => res.status(404).json(err))
})

// $route  Post api/categorys/id
// @desc  编辑时查看 获取到单个信息  点击某一个时给发一个id进去
// @access  private
router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Category.findOne({ _id: req.params.id }).then(category => {
        if (!category) {
            return res.status(404).json('没有任何内容');
        }
        res.json(category);
    }).catch(err => res.status(404).json(err))
})
// $route  Post api/categorys/edit/:id
// @desc  确定编辑时 更新到单个信息  点击某一个时给发一个id进去
// @access  private
router.post("/edit/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    // const newUser = new User({name: req.body.name, email: req.body.email });
    const categoryFields = {};
    //如果有请求数据类型  将请求数据赋值给categoryFields
    if (req.body.title) categoryFields.title = req.body.title;
    if (req.body.slug) categoryFields.slug = req.body.slug;

    //拿到这些数据之后 去category模型数据表中查找
    Category.findOneAndUpdate({ _id: req.params.id }, //拿到
        { $set: categoryFields }, //设置 更新
        { new: true } //定义  是一个新的东西
    ).then(category => res.json(category))
})

// $route  Post api/categorys/delete/:id
// @desc  点击删除信息接口访问到api/categorys/delete/:id
// @access  private
router.delete("/delete/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Category.findOneAndRemove({ _id: req.params.id }).then(category => {
        category.save().then(category => res.json(new SuccessModel("删除成功")))
    }).catch(err => res.status(400).json(new ErrorModel("删除失败")))
})
module.exports = router;