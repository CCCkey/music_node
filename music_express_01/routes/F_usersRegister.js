const express = require('express')
const router = express.Router()
const md5 = require('../modules/md5.js')
const session = require('express-session')
const mysql = require('mysql')

/* mysql数据库 */
const pool = mysql.createPool({ // 数据库连接配置
	host:'127.0.0.1',
	user:'root',
	password:'root',
	database:'music'
})

router.post('/',(req,res) => { // 用户注册
	let {user_account,user_password,email} = req.body // 获取post参数
	
	pool.getConnection((err,conn) => { // 获取数据库连接
		if(err){
			throw err
		}
		/* sql语句和values参数 */
		
		// 1.查询用户名是否存在
		let sql = 'SELECT id FROM `user` WHERE user_account = ?' // sql语句
		let values = [user_account] // 参数
		// 2.注册用户
		let sql02 = 'INSERT INTO `user`(user_account,user_password,email) VALUES(?,?,?)'
		let values02 = [user_account,user_password,email]
		
		/* 数据库sql语句 */
		conn.query(sql,values,(err,results) => {
			if(err){
				throw err
			}
			if(results.length != 0){ // 存在用户名
				res.status(200).json({
					code:2,
					message:'用户名存在'
				})
			}
			else{ // 不存在用户名
				conn.query(sql02,values02,(err,results) => {
					conn.release();//释放数据库连接
					if(err){
						throw err
					}
					// 登陆成功，设置session
					let token = md5.getToken(results[0].id.toString())
					req.session.userToken = results[0].id.toString()
					
					res.status(200).json({ // 给客户端返回数据
						code:0,
						message:'用户注册成功'
					})
				})
			}
		})
	})
})

module.exports = router

