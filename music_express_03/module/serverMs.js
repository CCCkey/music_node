const db = require('./db')

// 用户
let userRegister = (user_account,user_password,email) => { // 用户注册
	return new Promise((resolve,reject) => {
		let sql = 'SELECT id FROM `user` WHERE user_account = ?' // 查询用户名是否存在
		let values = [user_account]
		
		let sql02 = 'INSERT INTO `user`(user_account,user_password,email) VALUES(?,?,?)'
		let values02 = [user_account,user_password,email]
		
		db.query(sql,values)
		.then(results => {
			if(results.length != 0){ // 用户名存在:select 返回一个数组，insert into，update，delete返回一个对象
				return reject(results) // 丢给reject
			}
			return db.query(sql02,values02)
		})
		.then(results => {
			resolve(results)
		})
	})
}

let userLogin = (user_account,user_password) => { // 用户登录
	return new Promise((resolve,reject) => {
		let sql = 'SELECT id,user_account FROM `user` WHERE user_account = ? AND user_password = ?'
		let values = [user_account,user_password]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
	})
}

// 音乐
let musicTopClick = (limit) => { // 点击量排行
	return new Promise((resolve,reject) => {
		let sql = 'SELECT id,music_name,singer,music_img_url FROM `music` WHERE del=0 ORDER BY click_number DESC LIMIT ? '
		let values = [limit]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
	})
}

let musicTopNew = (limit) => { // 新歌排行
	return new Promise((resolve,reject) => {
		let sql = 'SELECT id,music_name,singer,music_img_url FROM `music` WHERE del=0 ORDER BY create_time DESC LIMIT ?'
		let values = [limit]
		
		db.query(sql,values)
		.then(results => {
			console.log(results)
			resolve(results)
		})
	})
}

let musicId = (id) => { // 歌曲查找
	return new Promise((resolve,reject) => {
		console.log(id)
		let sql = 'SELECT id,music_name,singer,music_url,lyric_url,music_img_url,click_number from `music` WHERE id = ? AND del=0'
		let values = [id]
		
		let sql02 = 'UPDATE `music` SET click_number = click_number + 1' // sql自增
		let values = []
		
		db.query(sql,values)
		.then(results => {
			if(results.length != 0){
				resolve(results)
			}
			return db.query(sql02,values) // 增加点击量
		})
		.catch(err => {
			reject(err)
		})
	})
}

// 评论
let commentMs = (music_id,offset,limit) => { // 获取评论
	return new Promise((resolve,reject) => {
		let sql02 = `
			SELECT comment.content,comment.create_time,user.user_account FROM \`comment\` INNER JOIN \`user\`
			ON comment.user_id = user.id
			WHERE comment.music_id = ? AND comment.del=0 LIMIT ?,?
		` // 获取评论
		let values02 = [music_id,(offset - 1)*10,limit]
		
		let sql = 'SELECT count(*) FROM `comment` WHERE del=0 AND music_id = ?' // 获取总数
		let values = [music_id]
		
		let all = {}
		
		db.query(sql,values) // 获取总数
		.then(results => {
			all.totalPage = Math.ceil(results[0]['count(*)'] / limit) // 获取总页数
			all.cuttentPageNum = offset
			return db.query(sql02,values02) // 获取评论
		})
		.then(results => {
			all.data = results
			resolve(all)
		})
	})
}

let commentAdd = (user_id,music_id,content) => { // 添加评论
	return new Promise((resolve,reject) => {
		let sql = 'INSERT INTO `comment`(user_id,music_id,content) VALUES(?,?,?)'
		let values = [user_id,music_id,content]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
	})
	
}

module.exports = {
	userRegister,
	userLogin,
	musicTopClick,
	musicTopNew,
	musicId,
	commentMs,
	commentAdd
}