/*
* @Author: admin
* @Date:   2019-07-28 17:28:20
* @Last Modified by:   admin
* @Last Modified time: 2019-08-04 13:55:14
*/
const crypto=require('crypto');

module.exports=function(mingma){
	var md5=crypto.createHash('md5');
	var password=md5.update(mingma).digest('base64');
	return password
}