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

router.get('/:id',(req,res) => {
	console.log(req.params)
	let {id} = req.params
	id = JSON.parse(id) // 转数字
	
	pool.getConnection((err,conn) => {
		if(err){
			throw err
		}
		/* sql语句和values参数 */
		// 查找歌曲
		let sql = 'SELECT id,music_name,singer,music_url,lyric_url,music_img_url,click_number from `music` WHERE id = ? AND del=0'
		let values = [id]
		// 增加点击量
		let sql02 = 'UPDATE `music` SET click_number = click_number + 1 WHERE id = ?' // sql自增
		let values02 = [id]
		
		conn.query(sql,values,(err,results) => {
			if(err){
				throw err
			}
			if(results.length != 0){
				let data = results
				
				conn.query(sql02,values02,(err,results) => {
					conn.release();//释放数据库连接
					console.log(data)
					if(err){
						throw err
					}
					res.status(200).json({
						code:0,
						message:'查询音乐成功',
						data:data
					})
				})
			}
		})
		
	})
})

module.exports = router