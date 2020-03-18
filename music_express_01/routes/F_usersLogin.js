const express = require('express')
const router = express.Router()
const md5 = require('../modules/md5')
const session = require('express-session')
const mysql = require('mysql')

const pool = mysql.createPool({ // 创建pool连接池
	host:'127.0.0.1',
	user:'root',
	password:'root',
	database:'music'
})

router.post('/',(req,res) => {
	let {user_account,user_password} = req.body
	
	pool.getConnection((err,conn) => {
		if(err){
			throw err
		}
		
		/* sql语句和values参数 */
		let sql = 'SELECT id,user_account FROM `user` WHERE user_account = ? AND user_password = ?'
		let values = [user_account,user_password]
		
		conn.query(sql,values,(err,results) => {
			conn.release();//释放数据库连接
			if(err){
				throw err
			}
			if(results.length == 0){
				res.status(200).json({
					code:1,
					message:'用户密码不存在'
				})
			}
			else{
				// 登陆成功，设置session
				let token = md5.getToken(results[0].id.toString())
				req.session.userToken = results[0].id.toString()
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