/*
 * @Author: admin
 * @Date:   2019-08-11 00:31:11
 * @Last Modified by:   admin
 * @Last Modified time: 2019-09-05 11:23:34
 */
const express = require("express");
const router = express.Router();
const passport = require("passport");

const Artical = require("../../models/Artical.js");
const Category = require("../../models/Category.js");
const User = require("../../models/User.js");
const { SuccessModel, ErrorModel } = require('../../resModel/resModel.js')

//api/articals/test
router.get('/test', (req, res) => {
    res.json({ msg: '这是articals的test' })
})
var allCount;

// $route  Post api/articals/add
// @desc  点击增加时  创建信息接口 存储到数据库
// @access  private
router.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
    // const newUser = new User({name: req.body.name, email: req.body.email });
    const articalFields = {};
    Artical.count().then(count => {
        allCount = count.toString();
    })
    var removeTAG=(str)=>{
        return str.replace(/<[^>]+>/g, "");
    }
    //如果有请求数据类型  将请求数据赋值给articalFields
    // if(req.body.category) articalFields.category=req.body.category;
    Category.find({ title: req.body.forms.category }).then(artical => {
        articalFields.category = artical[0]._id;
        // console.log("category2222", articalFields.category)
        // console.log("req.body.forms", req.body.forms)
        articalFields._id = allCount.padStart(5, '0');
        articalFields.artical_ID = allCount.padStart(5, '0');
        if (req.body.forms.title) articalFields.title = req.body.forms.title;
        if (req.body.forms.content) articalFields.content =removeTAG( req.body.forms.content);
        // if(req.body.forms.author) articalFields.author=req.body.forms.author;
        if (req.body.forms.slug) articalFields.slug = req.body.forms.slug;
        if (req.body.forms.published) articalFields.published = true;
        if (req.body.forms.comments) articalFields.comments = req.body.forms.comments;
        //拿到这些数据之后 放入数据库表模型中，保存

        console.log("articalFields", articalFields)
        new Artical(articalFields).populate({ path: 'category' }).save().then(artical => {
            // console.log("artical", artical)
            res.json(new SuccessModel("添加赛事成功"))
        })
    })

})
// $route  Post api/articals/edit/:id
// @desc  确定编辑时 更新到单个文明在激昂信息  点击某一个时给发一个id进去
// // @access  private
router.post("/edit/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    // console.log("req.body",req.body)
    Category.findOne({ title: req.body.category.title }).then(category => {
        console.log("category", category)
        const articalFields = {};
        if (req.body.category) {
            articalFields.category = category._id;
            // articalFields.category.title =category.title
        }
        // console.log("req.body.category",req.body.category)
        if (req.body.title) articalFields.title = req.body.title;
        if (req.body.content) articalFields.content = req.body.content;
        if (req.body.author) articalFields.author = req.body.author;
        if (req.body.slug) articalFields.slug = req.body.slug;
        if (req.body.published) articalFields.published = req.body.published;
        if (req.body.comments) articalFields.comments = req.body.comments;
        Artical.findOneAndUpdate({ _id: req.params.id }, { $set: articalFields }, { new: true })
            .populate({ path: 'author' }).populate({ path: 'category' })
            .then(artical => {
                console.log("artical", artical)
                console.log("articalFields", articalFields)
                res.json(articalFields)
            })
    })
})

//创建赛事接口
router.get("/createMark/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    // console.log("req.body",req.body)
    Artical.findOneAndUpdate({ _id: req.params.id }, { $set: { published: true } })
        .then(artical => {
            res.json(new SuccessModel(artical,"创建赛事成功"))
        })
})

// $route  Post api/articals
// @desc  在资金流水页面时可以看到所有数据 获取所有信息
// @access  private
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    Artical.count().then(count => {
        console.log("count", count);
        Artical.find().populate({ path: 'author' }).populate({ path: 'category' })
            .then((articals) => {
                if (!articals) {
                    return res.status(404).json('没有任何内容');
                }
                res.json(articals);
            }).catch(err => res.status(404).json(err))
    })
    // Artical.find().populate({ path: 'author' }).populate({ path: 'category' }).then((articals) => {
    //     if (!articals) {
    //         return res.status(404).json('没有任何内容');
    //     }
    //     // console.log("这里是api的category",articals.category);
    //     // console.log("这里是api的author",articals.author);
    //     res.json(articals);
    // }).catch(err => res.status(404).json(err))
})




// $route  Post api/articals/id
// @desc  编辑时查看 获取到单个信息  点击某一个时给发一个id进去
// @access  private
router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    // console.log("编辑时的req",req)
    Artical.findOne({ _id: req.params.id })
    .populate({ path: 'author' })
    .populate({ path: 'category' })
    .then(artical => {
        // console.log("编辑时的获取req", artical)
        Category.findOne({ _id: artical.category }).then(category => {
            // console.log("category的title ", category.title)
            if (!artical) {
                return res.status(404).json('没有任何内容');
            }
            // console.log("编辑时的获取artical",artical );
            res.json(artical);
        })
    }).catch(err => res.status(404).json(err))
})


// $route  Post api/articals/mark/id
// @desc  编辑时查看 获取到单个信息  点击某一个时给发一个id进去
// @access  private
router.get("/mark/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    // Artical.findOne({ _id: req.params.id }).then(artical => {
    //     console.log("artical是", artical)
        Mark.findOne({ Mark_ID:req.params.id }).then(amark => {
            console.log("amark ", amark)
            if (!amark) {
                return res.status(404).json(new ErrorModel("没有任何内容"));
            }
            res.json(amark);
        })
    })
// })





// $route  Post api/articals/delete/:id
// @desc  点击删除信息接口访问到api/articals/delete/:id
// @access  private
router.delete("/delete/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Artical.findOneAndRemove({ _id: req.params.id }).then(artical => {
        artical.save().then(artical => res.json(new SuccessModel("删除成功")))
        //删完之后保存，然后重新发送更新artical数据表
    }).catch(err => res.status(400).json(new ErrorModel("删除失败")))
})
module.exports = router;