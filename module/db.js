/* 数据库连接 */

// 引入mysql模块
const mysql = require('mysql')

// 连接配置
const pool = mysql.createPool({
	host:'127.0.0.1',
	user:'root',
	password:'root',
	database:'music'
})

// 连接方法
exports.query = (sql,values) => {
	return new Promise((resolve,reject) => { // 新建一个promise对象
		pool.getConnection((err,conn) => { // 获取连接池中的连接对象
			if(err){
				throw err
			}
			conn.query(sql,values,(err,results) => { // 使用sql查询语句
				conn.release();//释放数据库连接
				if(err){
					throw err
				}
				resolve(results)
			})
		})
	})
}
