/*
 * @Author: admin
 * @Date:   2019-08-10 15:01:59
 * @Last Modified by:   admin
 * @Last Modified time: 2019-09-02 17:30:00
 */


// 赛事文章表--前端展览用的数据存储
const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const ArticalSchema = new Schema({
    _id: {
        type: String
    },
    artical_ID: {
        type: String
    },
    title: { //1文章标题
        type: String
    },
    content: { //2内文
        type: String
    },
    category: { //3文章分类
        type: Schema.Types.ObjectId,
        ref: 'categorys' //参考表名字
    },
    author: { //4发布人
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    slug: { //5url名称
        type: String
    },
    published: { //6发布状态
        type: Boolean,
        default: false
    },
    // meta:{//7被赞次数
    // 	type:{}
    // },
    status: {
        type: Boolean,
        defalut: true
    },
    comments: [ //8评论
        // Schema.Types.Mixed
        // { type: Schema.Types.ObjectId, ref: 'Comment' }
    ],
    date: { //9创建时间
        type: Date,
        default: Date.now
    },
    mark: {
        type: Schema.Types.ObjectId,
        ref: 'marks' //参考表名字
    }


})

module.exports = Artical = mongoose.model("articals", ArticalSchema)