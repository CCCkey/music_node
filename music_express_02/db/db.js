const mysql = require('mysql')

// 创建pool连接池
const pool = mysql.createPool({
	host:'127.0.0.1',
	user:'root',
	password:'root',
	database:'music'
})

exports.query = (sql,values) => {
	return new Promise((resolve,reject) => {
		pool.getConnection((err,conn) => {
			if(err){
				reject(1)
			}
			conn.query(sql,values,(err,results) => {
				conn.release() // 释放连接
				if(err){
					reject(1)
				}
				resolve(results)
			})
		})
	})
}
