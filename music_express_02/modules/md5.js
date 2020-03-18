/**
 * @desAcription 加密算法
 * 
 */

let crypto = require("crypto"); // 加载crypto原生模块

// 获得token MD5
let getToken = function(id){
	let md5 = crypto.createHash('md5'); // 创建MD5加密算法
	md5.update(id); // 传入初始值
	return md5.digest('hex'); // 返回加密值
}

exports.getToken = getToken; // 定义获得token方法