/*
* @Author: admin
* @Date:   2019-08-30 10:15:03
* @Last Modified by:   admin
* @Last Modified time: 2019-08-30 13:38:17
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
	console.log("passport",passport)
	passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{//done是回调函数
		Student.findById(jwt_payload.id).then(student => {
		    if (student) { //如果当前用户存在
		        return done(null, student);
		    }
		    return done(null, false);
		}).catch(err => {
		    console.log(err);
		});
	}));
	passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{//done是回调函数
		Teacher.findById(jwt_payload.id).then(student => {
		    if (student) { //如果当前用户存在
		        return done(null, student);
		    }
		    return done(null, false);
		}).catch(err => {
		    console.log(err);
		});
	}));
	passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{//done是回调函数
		User.findById(jwt_payload.id).then(student => {
		    if (student) { //如果当前用户存在
		        return done(null, student);
		    }
		    return done(null, false);
		}).catch(err => {
		    console.log(err);
		});
	}));
}