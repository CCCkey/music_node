const db = require('./db.js')

// 管理员（admin）

let adminLogin = (admin_account,admin_password) => {
	return new Promise((resolve,reject) => {
		let sql = 'SELECT id, admin_account FROM `admin` WHERE admin_account = ? AND admin_password = ?' // 根据管理员用户名和密码
		let values = [admin_account,admin_password]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
	})
}

// 用户相关 （user）


let userShow = (offset,limit) => { // 获取用户列表
	return new Promise((resolve, reject) => {
		
		let sql02 = 'SELECT * FROM `user` WHERE del=0 LIMIT ? , ?' // 获取用户
		let values02 = [(offset - 1)*10,limit]
		
		let sql = 'SELECT count(*) FROM `user` WHERE del=0' // 获取总数
		let values = null
		
		let all = {}
		
		db.query(sql,values)
		.then(results => {
			all.totalPages = Math.ceil(results[0]['count(*)'] / limit) // 获取总页数
			all.currentPageNum = offset
			return db.query(sql02,values02)
		})
		.then(results => {
			all.results = results
			resolve(all)
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
		})
	})
}

let userDelete = (user_id) => { // 删除用户列表
	return new Promise((resolve,reject) => {
		let sql = 'UPDATE `user` set del=1 WHERE id = ?' // 删除表格
			
		let values = [user_id]		
		
		db.query(sql,values)
		.then(results => { 
			resolve(results)
		})
	})
}

// 音乐相关 （music）

let musicShow = (offset,limit) => { // 获取音乐列表
	offset = offset
	return new Promise((resolve,reject) => {
		let sql02 = 'SELECT * FROM `music` WHERE del=0 LIMIT ?, ?'
		let values02 = [(offset - 1)*10,limit]
		
		let sql = 'SELECT count(*) FROM `music`' // 获取总数
		let values = null
		
		let all = {}
		
		db.query(sql,values)
		.then(results => {
			all.totalPages = Math.ceil(results[0]['count(*)'] / limit) // 获取总页数
			all.currentPageNum = offset
			return db.query(sql02,values02)
		})
		.then(results => {
			all.results = results
			resolve(all)
		})
	})
}

let musicAdd = (music_name,singer,music_url,lyric_url,music_img_url) => { // 增加音乐列表
	return new Promise((resolve,reject) => {
		let sql = 'INSERT INTO `music`(music_name, singer, music_url, lyric_url, music_img_url) values (?,?,?,?,?)'
		let values = [music_name,singer,music_url,lyric_url,music_img_url]  // 插入数据
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
	})
}

let musicUpdate = (music_id,music_name,singer,) => { // 修改音乐列表
	return new Promise((resolve,reject) => {
		let sql = 'UPDATE `music` SET music_name = ?, singer = ?  WHERE id = ?'
		let values = [music_name,singer,music_id]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
	})
}

let musicDelete = (music_id) => { // 删除音乐列表
	return new Promise((resolve,reject) => {
		
		let sql = 'UPDATE `music` set del=1 WHERE id = ?' // 删除表格
	
		let values = [music_id]		
		
		db.query(sql,values)
		.then(results => { 
			resolve(results)
		})
	})
}

// 评论相关

let commentShow = (offset,limit) => { // 获取评论列表
	return new Promise((resolve,reject) => {
		offset = offset
		let sql02 =
		`SELECT comment.id,user.user_account,music.music_name,comment.content,comment.create_time,comment.del FROM \`comment\`   
		INNER JOIN  \`music\` ON comment.music_id=music.id
		INNER JOIN \`user\` ON comment.user_id = user.id
		WHERE comment.del=0 LIMIT ?,?; 
		`
		let values02 = [(offset - 1)*10,limit]
		
		let sql = 'SELECT count(*) FROM `comment` WHERE del=0' // 获取总数
		let values = null
		
		let all = {}
		
		db.query(sql,values)
		.then(results => {
			console.log(results)
			all.totalPages = Math.ceil(results[0]['count(*)'] / limit) // 获取总页数
			all.currentPageNum = offset
			return db.query(sql02,values02)
		})
		.then(results => {		
			all.results = results
			resolve(all)
		})
	})
}

let commentUpdate = (comment_id,content) => { // 修改评论列表
	return new Promise((resolve,reject) => {
		let sql = 'UPDATE `comment` SET content = ? WHERE id = ?'
		let values = [content,comment_id]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
	})
}

let commentDelete = (comment_id) => { // 删除评论列表
	return new Promise((resolve,reject) => {
		
		let sql = 'UPDATE `comment` set del=1 WHERE id = ?' // 删除表格
			
		let values = [comment_id]		
		
		db.query(sql,values)
		.then(results => { 
			resolve(results)
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
