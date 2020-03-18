const db = require('./db')

// 前台
let musicId = (id) => {
	return new Promise((resolve,reject) => {
		// 查找歌曲
		let sql = 'SELECT id,music_name,singer,music_url,lyric_url,music_img_url,click_number from `music` WHERE id = ? AND del=0'
		let values = [id]
		// 增加点击量
		let sql02 = 'UPDATE `music` SET click_number = click_number + 1 WHERE id = ?' // sql自增
		let values02 = [id]
		
		let data = []
		
		db.query(sql,values)
		.then(results => {
			if(results.length != 0){ // 如果歌曲存在
				console.log('cunzai')
				data = results
				
				return db.query(sql02,values02) // 增加点击量
			}
			resolve(results)
		},err => {
			reject(err)
		})
		.then(results => {
			resolve(data)
		},err => {
			reject(err)
		})
	})
}

let musicClick = (limit) => {
	return new Promise((resolve,reject) => {
		/* sql语句和values参数 */
		let sql = 'SELECT id,music_name,singer,music_img_url FROM `music` WHERE del=0 ORDER BY click_number DESC LIMIT ? '
		let values = [limit]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
		.catch(err => {
			reject(err)
		})
	})
}

let musicNew = (limit) => {
	return new Promise((resolve,reject) => {
		/* sql语句和values参数 */
		let sql = 'SELECT id,music_name,singer,music_img_url FROM `music` WHERE del=0 ORDER BY create_time DESC LIMIT ?'
		let values = [limit]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
		.catch(err => {
			reject(err)
		})
	})
}

// 后台

let musicShow = (offset,limit) => {
	return new Promise((resolve,reject) => {
		/* sql语句和values参数 */
		let sql = 'SELECT count(*) FROM `music`' // 获取总数
		let values = null
		
		let sql02 = 'SELECT * FROM `music` WHERE del=0 LIMIT ?, ?'
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
			resolve(all)
		})
	})
}

let musicUpdate = (music_id,music_name,singer) => {
	return new Promise((resolve,reject) => {
		/* sql语句和values参数 */
		let sql = 'UPDATE `music` SET music_name = ?, singer = ?  WHERE id = ? AND del = 0'
		let values = [music_name,singer,music_id]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
		.catch(err => {
			reject(err)
		})
	})
}

let musicDelete = (music_id) => {
	return new Promise((resolve,reject) => {
		/* sql语句和values参数 */
		let sql = 'UPDATE `music` set del=1 WHERE id = ?' // 删除表格
			
		let values = [music_id]	
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
		.catch(err => {
			reject(err)
		})
	})
}

let musicAdd = (music_name,singer,music_url,lyric_url,music_img_url) => {
	return new Promise((resolve,reject) => {
		/* sql语句和values参数 */
		let sql = 'INSERT INTO `music`(music_name, singer, music_url, lyric_url, music_img_url) values (?,?,?,?,?)'
		let values = [music_name,singer,music_url,lyric_url,music_img_url]  // 插入数据
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
		.catch(err => {
			reject(err)
		})
	})
}

module.exports = {
	musicId,
	musicClick,
	musicNew,
	musicShow,
	musicUpdate,
	musicDelete,
	musicAdd
}