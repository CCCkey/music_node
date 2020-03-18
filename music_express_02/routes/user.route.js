const express = require('express')
const router = express.Router()
const {jsonWrite} = require('../modules/jsonWrite')
const md5 = require('../modules/md5')
const session = require('express-session')
const {
	userRegister,
	userLogin,
	userShow,
	userUpdate,
	userDelete
} = require('../db/user.db')

// 前台
router.post('/register',(req,res) => {
	let {user_account,user_password,email} = req.body
	
	userRegister(user_account,user_password,email)
	.then(results => {
		res.status(200).json({ // 给客户端返回数据
			code:0,
			message:'success'
		})
	})
	.catch(err => {
		jsonWrite(res,err)
	})
})

router.post('/login',(req,res) => {
	let {user_account,user_password} = req.body
	
	userLogin(user_account,user_password)
	.then(results => {
		// 登陆成功，设置session
		let token = md5.getToken(results[0].id.toString())
		req.session.userToken = results[0].id.toString()
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

// 后台
router.get('/',(req,res) => {
	console.log('userShow')
	let {offset,limit,token} = req.query
	offset = JSON.parse(offset) // 转数字
	limit = JSON.parse(limit)
	
	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		jsonWrite(res,3)
		return
	}
	userShow(offset,limit)
	.then(results => {
		res.status(200).json({
			code: 0,
			message: 'success',
			data: results
		})
	})
	.catch(err => {
		jsonWrite(res,err)
	})
})

router.put('/',(req,res) => {
	let {
		user_id,
		user_account,
		user_password,
		email,
		token
	} = req.body
	
	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		jsonWrite(res,3)
		return
	}
	userUpdate(user_account,user_password,email,user_id)
	.then(results => {
		res.status(200).json({
			code: 0,
			message: 'success',
		})
	})
	.catch(err => {
		jsonWrite(res,err)
	})
})

router.delete('/',(req,res) => {
	let {
		user_id,
		token
	} = req.body
	user_id = JSON.parse(user_id) // 转数字
	
	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		jsonWrite(res,3)
		return
	}
	userDelete(user_id)
	.then(results => {
		res.status(200).json({
			code: 0,
			message: 'success'
		})
	})
	.catch(err => {
		jsonWrite(res,err)
	})
})

module.exports = router