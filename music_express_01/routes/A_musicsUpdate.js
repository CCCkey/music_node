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

router.put('/',(req,res) => {
	let {
		music_id,
		music_name,
		singer,
		token
	} = req.body
	music_id = JSON.parse(music_id) // 转数字
	
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
			let sql = 'UPDATE `music` SET music_name = ?, singer = ?  WHERE id = ? AND del = 0'
			let values = [music_name,singer,music_id]
			
			conn.query(sql,values,(err,results) => {
				conn.release();//释放数据库连接
				if(err){
					throw err
				}
				if (!results.affectedRows) { // 通过affectedRows的值，判断sql语句是否操作成功
					res.status(200).json({
						code: 2,
						message: '修改音乐失败'
					})
				} else {
					res.status(200).json({
						code: 0,
						message: '修改音乐成功'
					})
				}
			})
		})
	}
})

module.exports = router