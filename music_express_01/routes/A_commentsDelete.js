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

router.delete('/',(req,res) => {
	let {
		comment_id,
		token
	} = req.body
	comment_id = JSON.parse(comment_id) // 转数字
	
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
			let sql = 'UPDATE `comment` set del=1 WHERE id = ?' // 删除表格
			let values = [comment_id]	
			
			conn.query(sql,values,(err,results) => {
				conn.release();//释放数据库连接
				if(err){
					throw err
				}
				if (!results.changedRows) { // 通过changedRows的值，判断sql语句是否操作成功
					res.status(200).json({
						code: 2,
						message: '删除评论失败'
					})
				} else {
					res.status(200).json({
						code: 0,
						message: '删除评论成功'
					})
				}
			})
		})
	}
})

module.exports = router