/*
* @Author: admin
* @Date:   2019-08-30 10:15:03
* @Last Modified by:   admin
* @Last Modified time: 2019-08-30 16:18:55
*/
/*
* @Author: admin
* @Date:   2019-08-04 07:15:22
* @Last Modified by:   admin
* @Last Modified time: 2019-08-30 09:15:07
*/
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose=require("mongoose");
// const Student=mongoose.model("students");//引入数据库表
// const Teacher=mongoose.model("teachers");//引入数据库表
const keys=require("../config/db.js")
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey=keys.secretOrKey;


module.exports=passport=>{
    passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{//done是回调函数
        // console.log("opts",opts)
        // console.log("jwt_payload",jwt_payload);
        if(jwt_payload.identity==='admin'){
            User.findById(jwt_payload.id).then(admin => {
            if (admin) { //如果当前用户存在
                return done(null, admin);
                }
                return done(null, false);
                }).catch(err => {
                    console.log(err);
                });
        }
        else if(jwt_payload.identity==='teacher'){
            Teacher.findById(jwt_payload.id).then(teacher => {
            if (teacher) { //如果当前用户存在
                return done(null, teacher);
                }
                return done(null, false);
                }).catch(err => {
                    console.log(err);
                });
        }
        else if(jwt_payload.identity==='student'){
            Student.findById(jwt_payload.id).then(student => {
            if (student) { //如果当前用户存在
                return done(null, student);
                }
                return done(null, false);
                }).catch(err => {
                    console.log(err);
                });
        }
        
    }));
}