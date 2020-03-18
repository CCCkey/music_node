const express = require('express')
const router = express.Router()
const mysql = require('mysql')

/* mysql数据库 */
let pool = mysql.createPool({
	host:'127.0.0.1',
	user:'root',
	password:'root',
	database:'music'
})

router.post('/',(req,res) => {
	let {user_id,music_id,content,token} = req.body
	
	pool.getConnection((err,conn) => {
		if(err){
			throw err
		}
		/* sql语句和values参数 */
		let sql = 'INSERT INTO `comment`(user_id,music_id,content) VALUES(?,?,?)'
		let values = [user_id,music_id,content]
		
		pool.query(sql,values,(err,results) => { // query的三个参数:sql语句，参数，回调函数
			conn.release();//释放数据库连接
			if(err){
				throw err
			}
			res.status(200).json({
				code:0,
				message:'添加评论成功',
				data:results
			})
		})
	})
})

module.exports = router