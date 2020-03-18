const db = require('./db')

// 前台
let commentAdd = (user_id,music_id,content) => {
	return new Promise((resolve,reject) => {
		/* sql语句和values参数 */
		let sql = 'INSERT INTO `comment`(user_id,music_id,content) VALUES(?,?,?)'
		let values = [user_id,music_id,content]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
		.catch(err => {
			reject(err)
		})
	})
}

let commentMusicId = (music_id,offset,limit) => {
	return new Promise((resolve,reject) => {
		// 获取总数
		let sql = 'SELECT count(*) FROM `comment` WHERE del=0 AND music_id = ?' // 获取总数
		let values = [music_id]
		// 获取评论
		let sql02 = `
			SELECT comment.content,comment.create_time,user.user_account FROM \`comment\` INNER JOIN \`user\`
			ON comment.user_id = user.id
			WHERE comment.music_id = ? AND comment.del=0 LIMIT ?,?
		`
		let values02 = [music_id,(offset - 1)*10,limit]
		
		let all = {}
		
		db.query(sql,values)
		.then(results => {
			all.totalPage = Math.ceil(results[0]['count(*)'] / limit)
			all.cuttentPageNum = offset
			
			return db.query(sql02,values02)
		},err => {
			reject(err)
		})
		.then(results => {
			all.results = results
			resolve(all)
		})
	})
}

// 后台
let commentShow = (offset,limit) => {
	return new Promise((resolve,reject) => {
		/* sql语句和values参数 */
		let sql = 'SELECT count(*) FROM `comment` WHERE del=0' // 获取总数
		let values = null
		
		let sql02 =
		`SELECT comment.id,user.user_account,music.music_name,comment.content,comment.create_time,comment.del FROM \`comment\`   
		INNER JOIN  \`music\` ON comment.music_id=music.id
		INNER JOIN \`user\` ON comment.user_id = user.id
		WHERE comment.del=0 LIMIT ?,?; 
		`
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
			resolve(results)
		},err => {
			reject(err)
		})
		
	})
}
let commentDelete = (comment_id) => {
	return new Promise((resolve,reject) => {
		/* sql语句和values参数 */
		let sql = 'UPDATE `comment` set del=1 WHERE id = ?' // 删除表格
		let values = [comment_id]	
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		},err => {
			reject(err)
		})
	})
}
let commentUpdate = (comment_id,content) => {
	return new Promise((resolve,reject) => {
		/* sql语句和values参数 */
		let sql = 'UPDATE `comment` SET content = ? WHERE id = ?'
		let values = [content,comment_id]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		},err => {
			reject(err)
		})
	})
}

module.exports = {
	commentAdd,
	commentMusicId,
	commentShow,
	commentDelete,
	commentUpdate
}