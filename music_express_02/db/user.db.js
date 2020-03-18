const db = require('./db')

/* 前台 */
let userRegister = (user_account,user_password,email) => {
	return new Promise((resolve,reject) => {
		// 1.查询用户名是否存在
		let sql = 'SELECT id FROM `user` WHERE user_account = ?' // sql语句
		let values = [user_account] // 参数
		// 2.注册用户
		let sql02 = 'INSERT INTO `user`(user_account,user_password,email) VALUES(?,?,?)'
		let values02 = [user_account,user_password,email]
		
		db.query(sql,values)
		.then(results => {
			if(results.length != 0){ // 若用户名存在
				reject(2)
				return
			}
			return db.query(sql02,values02)
		},err => {
			reject(err)
		})
		.then(results => {
			resolve(results)
		},err => {
			reject(err)
		})
	})
}
let userLogin = (user_account,user_password) => {
	return new Promise((resolve,reject) => {
		
		/* sql语句和values参数 */
		let sql = 'SELECT id,user_account FROM `user` WHERE user_account = ? AND user_password = ?'
		let values = [user_account,user_password]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
		.catch(err => {
			err
		})
	})
}
/* 后台 */
let userShow = (offset,limit) => {
	return new Promise((resolve,reject) => {
		/* sql语句和values参数 */
		let sql = 'SELECT count(*) FROM `user` WHERE del=0' // 获取总数
		let values = null
		
		let sql02 = 'SELECT * FROM `user` WHERE del=0 LIMIT ? , ?' // 获取用户
		let values02 = [(offset - 1)*10,limit]
		
		let all = {}
		
		db.query(sql,values)
		.then(results => {
			all.totalPages = Math.ceil(results[0]['count(*)'] / limit) // 获取总页数
			all.currentPageNum = offset
			
			return db.query(sql02,values02)
		},err => {
			reject(err)
		})
		.then(results => {
			all.results = results
			console.log(all)
			resolve(all)
		})
	})
}
let userUpdate = (user_id,user_account,user_password,email) => {
	return new Promise((resolve,reject) => {
		/* sql语句和values参数 */
		let sql = 'UPDATE `user` SET user_account = ?, user_password = ?, email = ? WHERE id = ?'
		let values = [user_account,user_password,email,user_id]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
		.catch(err => {
			reject(err)
		})
	})
}
let userDelete = (user_id) => {
	return new Promise((resolve,reject) => {
		/* sql语句和values参数 */
		let sql = 'UPDATE `user` set del=1 WHERE id = ?' // 删除表格
		let values = [user_id]	
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
		.catch(err => {
			rejct(err)
		})
	})
}

module.exports = {
	userRegister,
	userLogin,
	userShow,
	userUpdate,
	userDelete
}