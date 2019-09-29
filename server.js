/*
 * @Author: admin
 * @Date:   2019-06-08 20:24:50
 * @Last Modified by:   admin
 * @Last Modified time: 2019-09-01 17:59:21
 */
const express = require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const passport=require("passport");
const app = express();

//引入users.js
const articals=require("./routes/api/Artical.js")
const categorys=require("./routes/api/categorys.js")
const marks=require("./routes/api/marks.js")
const users=require("./routes/api/users.js")
const students=require("./routes/api/students.js")
const teachers=require("./routes/api/teachers.js")
// const identitys=require("./routes/api/Identity.js")
const grades=require("./routes/api/grades.js")
// 本地数据库2
const db=require("./config/db.js").mongoURI;
mongoose.connect(db, { useNewUrlParser: true })
		.then(()=>{
			console.log("连接成功");
		})
		.catch(err=>{
			console.log(err)
		})


//使用bodyParser中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
//passport初始化
app.use(passport.initialize());
require("./config/passport.js")(passport);//引入并后面传递passport

app.get("/", (req, res) => {
    res.send("hello world")
})

//使用routes
app.use("/api/articals",articals);
app.use("/api/categorys",categorys);
app.use("/api/marks",marks)
app.use("/api/users",users);
app.use("/api/students",students);
app.use("/api/teachers",teachers);
// app.use("/api/identitys",identitys);
app.use("/api/grades",grades);

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log("正在监听127.0.0.1:5001")
})