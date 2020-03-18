let express = require('express')
let router = express.Router()
let md5 = require('../modules/md5.js')
let session = require('express-session')
let mysql = require('mysql')

/* mysql数据库 */
let pool = mysql.createPool({
	host:'127.0.0.1',
	user:'root',
	password:'root',
	database:'music'
})

router.post('/',(req,res) => {
	let {admin_account,admin_password} = req.body
	
	pool.getConnection((err,conn) => {
		if(err){
			throw err
		}
		/* sql语句和values参数 */
		let sql = 'SELECT id, admin_account FROM `admin` WHERE admin_account = ? AND admin_password = ?'
		values = [admin_account,admin_password]
		
		conn.query(sql,values,(err,results) => {
			conn.release();//释放数据库连接
			if(err){
				throw err
			}
			if (results.length === 0) { // 通过数组判断用户是否登录
				res.status(200).json({
					code: 2,
					message: '用户密码不存在',
				})
			} else {
				// 登陆成功，设置session
				let token = md5.getToken(results[0].id.toString())
				req.session.adminToken = results[0].id.toString()
				res.status(200).json({
					code: 0,
					message: '登陆成功',
					data: results,
					token: token
				})
			}
		})
	})
})

module.exports = router