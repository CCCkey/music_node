const express = require('express')
const router = express.Router()
const mysql = require('mysql')

/* mysql数据库 */
const pool = mysql.createPool({
	host:'127.0.0.1',
	user:'root',
	password:'root',
	database:'music'
})

router.get('/',(req,res) => {
	let {limit} = req.query
	limit = JSON.parse(limit) // 转数字
	
	pool.getConnection((err,conn) => {
		if(err){
			throw err
		}
		/* sql语句和values参数 */
		let sql = 'SELECT id,music_name,singer,music_img_url FROM `music` WHERE del=0 ORDER BY create_time DESC LIMIT ?'
		let values = [limit]
		
		conn.query(sql,values,(err,results) => {
			conn.release();//释放数据库连接
			if(err){
				throw err
			}
			res.status(200).json({
				code:0,
				message:'获取新歌列表成功',
				data:results
			})
		})
	})
})

module.exports = router