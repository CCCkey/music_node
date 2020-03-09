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
		let sql = 'SELECT * FROM user LIMIT ? , ?'
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

let userDelete = () => { // 删除用户列表
	return new Promise((resolve,reject) => {
		let sql = 'SET foreign_key_checks = 0'
		let sql02 = 'DELETE FROM `user` WHERE id = ?'
		let sql03 = 'SET foreign_key_checks = 1'
		let sql04 = 'SELECT @@foreign_key_checks'
		
		let values = undefined
		let values02 = [3]	
		
		// 关闭外键约束检查
		db.query(sql,values)
		.then(results => {
			console.log('关闭外键约束')
			return db.query(sql02,values02)
		})
		.then(results => {
			resolve(results)
			return db.query(sql03,values)
		},err => {
			reject(err)
		})
		.then(results => {
			console.log('打开外键约束')
		})
	})
}

// 音乐相关 （music）

let musicShow = () => { // 获取音乐列表
	return new Promise((resolve,reject) => {
		db.query(sql,values,(err,rows) => {
			if(err){
				reject(err)
			}
			resolve(rows)
		})
	})
}

let musicAdd = () => { // 增加音乐列表
	return new Promise((resolve,reject) => {
		db.query(sql,values,(err,rows) => {
			if(err){
				reject(err)
			}
			resolve(rows)
		})
	})
}

let musicUpdate = () => { // 修改音乐列表
	return new Promise((resolve,reject) => {
		db.query(sql,values,(err,rows) => {
			if(err){
				reject(err)
			}
			resolve(rows)
		})
	})
}

let musicDelete = () => { // 删除音乐列表
	return new Promise((resolve,reject) => {
		db.query(sql,values,(err,rows) => {
			if(err){
				reject(err)
			}
			resolve(rows)
		})
	})
}

// 评论相关

let commentShow = () => { // 获取评论列表
	return new Promise((resolve,reject) => {
		db.query(sql,values,(err,rows) => {
			if(err){
				reject(err)
			}
			resolve(rows)
		})
	})
}

let commentUpdate = () => { // 修改评论列表
	return new Promise((resolve,reject) => {
		db.query(sql,values,(err,rows) => {
			if(err){
				reject(err)
			}
			resolve(rows)
		})
	})
}

let commentDelete = () => { // 删除音乐列表
	return new Promise((resolve,reject) => {
		db.query(sql,values,(err,rows) => {
			if(err){
				reject(err)
			}
			resolve(rows)
		})
	})
}

module.exports = {
	adminLogin,
	userShow,
	userUpdate,
	userDelete
}
