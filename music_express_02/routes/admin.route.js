const express = require('express')
const router = express.Router()
const {adminLogin} = require('../db/admin.db')
const {jsonWrite} = require('../modules/jsonWrite')
const md5 = require('../modules/md5')
const session = require('express-session')

// 后台
router.post('/login',(req,res) => {
	let {admin_account,admin_password} = req.body
	
	adminLogin(admin_account,admin_password)
	.then(results => {
		// 登陆成功，设置session
		let token = md5.getToken(results[0].id.toString())
		req.session.adminToken = results[0].id.toString()
		res.status(200).json({
			code: 0,
			message: 'success',
			data: results,
			token: token
		})
	})
	.catch(err => {
		jsonWrite(res,err)
	})
})

module.exports = router