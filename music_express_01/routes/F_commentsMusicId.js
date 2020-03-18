const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const url = require('url')

/* mysql数据库连接 */
let pool = mysql.createPool({
	host:'127.0.0.1',
	user:'root',
	password:'root',
	database:'music'
})

router.get('/:music_id',(req,res) => {
	
	let {music_id} = req.params
	let {offset,limit} = req.query
	
	offset = JSON.parse(offset)
	limit = JSON.parse(limit)
	music_id = JSON.parse(music_id)
	
	pool.getConnection((err,conn) => {
		if(err){
			throw err
		}
		/* sql语句和values参数 */
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
		
		conn.query(sql,values,(err,results) => {
			if(err){
				throw err
			}
			all.totalPage = Math.ceil(results[0]['count(*)'] / limit)
			all.cuttentPageNum = offset
			conn.query(sql02,values02,(err,results) => {
				conn.release();//释放数据库连接
				if(err){
					throw err
				}
				res.status(200).json({
					code:0,
					message:'获取评论列表成功',
					data:results
				})
			})
		})
	})
})

module.exports = router