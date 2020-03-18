const db = require('./db.js')

let adminLogin = (admin_account,admin_password) => {
	return new Promise((resolve,reject) => {
		
		/* sql语句和values函数 */
		let sql = 'SELECT id, admin_account FROM `admin` WHERE admin_account = ? AND admin_password = ?'
		values = [admin_account,admin_password]
		
		db.query(sql,values)
		.then(results => {
			resolve(results)
		})
		.catch(err => {
			reject(err)
		})
	})
}

module.exports = {
	adminLogin
}