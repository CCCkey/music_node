let express = require('express')
let router = express.Router()
let md5 = require('../module/md5.js')

let server = require('../module/bgServer.js') // 加载数据库处理程序

// 管理员
router.post('/api/v1/admins/login',(req,res) => {
	server.adminLogin(req.body.admin_account,req.body.admin_password)
	.then((results) => {
		if(results.length === 0){
			res.status(200).json({
				code:1,
				message:'用户密码不存在',
			})
		}else{
			console.log(results)
			// 登陆成功，设置session
			let token = md5.getToken(results[0].id.toString())
			req.session.adminToken = results[0].id.toString()
			res.status(200).json({
				code:0,
				message:'登陆成功',
				data:results,
				token:token
			})
		}
	})
})

// 用户
router.get('/api/v1/users',(req,res) => { // 获取用户
	let {offset,limit,token} = req.query
	
	if(!req.session.adminToken || token != md5.getToken(req.session.adminToken)){
		res.status(200).json({
			code:1,
			message:'请重新登陆',
		})
	}else{
		server.userShow(JSON.parse(offset),JSON.parse(limit))
		.then(results => {
			res.status(200).json({
				code:0,
				message:'获取用户列表成功',
				data:results
			})
		})
	}
})

router.post('/api/v1/users',(req,res) => { // 修改用户
	let {user_id,user_account,user_password,email,token} = req.body
	
	if(!req.session.adminToken || token != md5.getToken(req.session.adminToken)){
		res.status(200).json({
			code:1,
			message:'请重新登陆',
		})
	}else{
		server.userUpdate(JSON.parse(user_id),user_account,user_password,email)
		.then(results => {
			res.status(200).json({
				code:0,
				message:'用户修改成功',
			})
		})
	}

})

router.post('/api/vi/users',(req,res) => { // 删除用户
	let {user_id,token} = req.body
	
	if(token != md5.getToken(req.session.adminToken)){
		res.status(200).json({
			code:1,
			message:'请重新登陆',
		})
	}else{
		server.userDelete(JSON.parse(user_id))
		.then(results => {
			res.status(200).json({
				code:0,
				message:'删除用户成功'
			})
		})
	}
	
})

module.exports = router

