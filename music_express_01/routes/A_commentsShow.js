let express = require('express')
let router = express.Router()
let mysql = require('mysql')
let md5 = require('../modules/md5')

/* mysql数据库 */
let pool = mysql.createPool({
	host:'127.0.0.1',
	user:'root',
	password:'root',
	database:'music'
})

router.get('/',(req,res) => {
	let {
		offset,
		limit,
		token
	} = req.query
	offset = JSON.parse(offset) // 转数字
	limit = JSON.parse(limit)
	
	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		res.status(200).json({
			code: 1,
			message: '请重新登陆',
		})
	} else {
		pool.getConnection((err,conn) => {
			if(err){
				throw err
			}
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
			
			conn.query(sql,values,(err,results) => {
				if(err){
					throw err
				}
				all.totalPages = Math.ceil(results[0]['count(*)'] / limit) // 获取总页数
				all.currentPageNum = offset
				conn.query(sql02,values02,(err,results) => {
					conn.release();//释放数据库连接
					if(err){
						throw err
					}
					all.results = results
					res.status(200).json({
						code: 0,
						message: '获取评论列表成功',
						data: all
					})
				})
			})
		})	
	}
})

module.exports = router