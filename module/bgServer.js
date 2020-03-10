const db = require('./db.js')

// 管理员（admin）

let adminLogin = (admin_account,admin_password) => {
	return new Promise((resolve,reject) => {
		let sql = 'SELECT id, admin_account FROM `admin` WHERE admin_account = ? AND admin_password = ?' // 根据管理员用户名和密码
		let values = [admin_account,admin_password]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		},err => {
			reject(err)
		})
	})
}

// 用户相关 （user）


let userShow = (offset,limit) => { // 获取用户列表
	return new Promise((resolve, reject) => {
		let sql = 'SELECT * FROM `user` LIMIT ? , ?'
		let values = [offset,limit]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		},err => {
			reject(err)
		})
	})
}

let userUpdate = (user_id,user_account,user_password,email) => { // 修改用户列表
	return new Promise((resolve,reject) => {
		let sql = 'UPDATE `user` SET user_account = ?, user_password = ?, email = ? WHERE id = ?'
		let values = [user_account,user_password,email,user_id]
		db.query(sql,values)
		.then(results => {
			resolve(results)
		},err => {
			reject(err)
		})
	})
}

let userDelete = (user_id) => { // 删除用户列表
	return new Promise((resolve,reject) => {
		let sql = 'SET foreign_key_checks = 0'  // 关闭外链约束
		let sql02 = 'DELETE FROM `user` WHERE id = ?' // 删除表格
		let sql03 = 'SET foreign_key_checks = 1'  // 打开外链约束
		let sql04 = 'SELECT @@foreign_key_checks' // 查询外链约束
		
		let values = undefined
		let values02 = [user_id]	
		
		
		db.query(sql,values)
		.then(results => { // 关闭外键约束检查
			console.log('关闭外键约束') 
			return db.query(sql02,values02)
		})
		.then(results => { // 删除数据
			resolve(results)
			return db.query(sql03,values)
		},err => {
			reject(err)
		})
		.then(results => { // 打开外链约束检查
			console.log('打开外键约束')
		})
	})
}

// 音乐相关 （music）

let musicShow = (offset,limit) => { // 获取音乐列表
	return new Promise((resolve,reject) => {
		let sql = 'SELECT * FROM `music` LIMIT ?, ?'
		let values = [offset,limit]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		},err => {
			reject(err)
		})
	})
}

let musicAdd = (music_name,singer,music_data,lyric_data,music_img_data) => { // 增加音乐列表
	return new Promise((resolve,reject) => {
		let sql = 'INSERT INTO `music`(music_name, singer, music_url, lyric_url, music_img_url) values (?,?,?,?,?)'
		let values = [music_name,singer,music_data,lyric_data,music_img_data]  // 插入数据
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		},err => {
			reject(err)
		})
	})
}

let musicUpdate = (music_id,music_name,singer,music_data,lyric_data,music_img_data) => { // 修改音乐列表
	return new Promise((resolve,reject) => {
		let sql = 'UPDATE `music` SET music_name = ?, singer = ?, music_url = ?, lyric_url = ?, music_img_url = ? WHERE id = ?'
		let values = [music_name,singer,music_data,lyric_data,music_img_data,music_id]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		},err => {
			reject(err)
		})
	})
}

let musicDelete = (music_id) => { // 删除音乐列表
	return new Promise((resolve,reject) => {
		
		let sql = 'SET foreign_key_checks = 0'  // 关闭外链约束
		let sql02 = 'DELETE FROM `music` WHERE id = ?' // 删除表格
		let sql03 = 'SET foreign_key_checks = 1'  // 打开外链约束
		let sql04 = 'SELECT @@foreign_key_checks' // 查询外链约束
		
		let values = undefined
		let values02 = [music_id]	
		
		
		db.query(sql,values)
		.then(results => { // 关闭外键约束检查
			console.log('关闭外键约束') 
			return db.query(sql02,values02)
		})
		.then(results => { // 删除数据
			resolve(results)
			return db.query(sql03,values)
		},err => {
			reject(err)
		})
		.then(results => { // 打开外链约束检查
			console.log('打开外键约束')
		})
	})
}

// 评论相关

let commentShow = (offset,limit) => { // 获取评论列表
	return new Promise((resolve,reject) => {
		let sql = 'SELECT * FROM `comment` LIMIT ?, ?'
		let values = [offset,limit]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		},err => {
			reject(err)
		})
	})
}

let commentUpdate = (commentId,content) => { // 修改评论列表
	return new Promise((resolve,reject) => {
		let sql = 'UPDATE `comment` SET content = ? WHERE id = ?'
		let values = [content,commentId]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		},err => {
			reject(err)
		})
	})
}

let commentDelete = (commentId) => { // 删除评论列表
	return new Promise((resolve,reject) => {
		
		let sql = 'DELETE FROM `comment` WHERE id = ?' // 删除表格
		let values = [commentId]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		},err => {
			reject(err)
		})
	})
}

module.exports = {
	adminLogin,
	userShow,
	userUpdate,
	userDelete,
	musicShow,
	musicAdd,
	musicUpdate,
	musicDelete,
	commentShow,
	commentUpdate,
	commentDelete
}
