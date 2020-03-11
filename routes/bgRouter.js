let express = require('express')
let router = express.Router()
let md5 = require('../module/md5.js')

let server = require('../module/bgServer.js') // 加载数据库处理程序

// 管理员 --------------
router.post('/api/v1/admins/login',(req,res) => {
	server.adminLogin(req.body.admin_account,req.body.admin_password)
	.then((results) => {
		if(results.length === 0){
			res.status(200).json({
				code:1,
				message:'用户密码不存在',
			})
		}else{
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

// 用户 --------------------
router.get('/api/v1/users',(req,res) => { // 获取用户
	let {offset,limit,token} = req.query
	
	console.log(req.session.adminToken)
	
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

router.put('/api/v1/users',(req,res) => { // 修改用户
	let {user_id,user_account,user_password,email,token} = req.body
	
	if(!req.session.adminToken || token != md5.getToken(req.session.adminToken)){
		res.status(200).json({
			code:1,
			message:'请重新登陆',
		})
	}else{
		server.userUpdate(JSON.parse(user_id),user_account,user_password,email)
		.then(results => {
			if(!results.affectedId){ // 通过affectedID的值，判断sql语句是否操作成功
				res.status(200).json({
					code:2,
					message:'用户修改失败',
					data:results
				})
			}else{
				res.status(200).json({
					code:0,
					message:'用户修改成功',
				})
			}
		})
	}

})

router.delete('/api/v1/users',(req,res) => { // 删除用户
	let {user_id,token} = req.body
	
	if(token != md5.getToken(req.session.adminToken)){
		res.status(200).json({
			code:1,
			message:'请重新登陆',
		})
	}else{
		server.userDelete(JSON.parse(user_id))
		.then(results => {
			if(!results.affectedId){ // 通过affectedID的值，判断sql语句是否操作成功
				res.status(200).json({
					code:2,
					message:'用户删除失败',
					data:results
				})
			}else{
				res.status(200).json({
					code:0,
					message:'用户删除成功'
				})
			}
		})
	}
	
})

// 音乐 ---------------
router.get('/api/v1/musics',(req,res) => { // 获取音乐
	let {offset,limit,token} = req.query
	
	if(!req.session.adminToken || token != md5.getToken(req.session.adminToken)){
		res.status(200).json({
			code:1,
			message:'fail',
		})
	}else{
		server.musicShow(JSON.parse(offset),JSON.parse(limit))
		.then(results => {
			res.status(200).json({
				code:0,
				message:'success',
				data:results
			})
		})
	}
})

router.post('/api/v1/musics',(req,res) => { // 添加音乐
	let {music_name,singer,music_data,lyric_data,music_img_data,token} = req.body
	
	if(!req.session.adminToken || token != md5.getToken(req.session.adminToken)){
		res.status(200).json({
			code:1,
			message:'请重新登陆',
		})
	}else{
		server.musicAdd(music_name,singer,music_data,lyric_data,music_img_data)
		.then(results => {
			if(!results.affectedId){ // 通过affectedID的值，判断sql语句是否操作成功
				res.status(200).json({
					code:2,
					message:'用户添加失败',
					data:results
				})
			}else{
				res.status(200).json({
					code:0,
					message:'用户添加成功',
					data:results
				})
			}
		})
	}

})

router.put('/api/v1/musics',(req,res) => { // 修改音乐
	let {music_id,music_name,singer,music_data,lyric_data,music_img_data,token} = req.body
	
	if(!req.session.adminToken || token != md5.getToken(req.session.adminToken)){
		res.status(200).json({
			code:1,
			message:'请重新登陆',
		})
	}else{
		server.musicUpdate(JSON.parse(music_id),music_name,singer,music_data,lyric_data,music_img_data)
		.then(results => {
			if(!results.affectedRows){ // 通过affectedID的值，判断sql语句是否操作成功
				res.status(200).json({
					code:2,
					message:'用户修改失败'
				})
			}else{
				res.status(200).json({
					code:0,
					message:'用户修改成功'
				})
			}
		})
	}

})

router.delete('/api/v1/musics',(req,res) => { // 删除音乐
	let {music_id,token} = req.body
	
	if(!req.session.adminToken || token != md5.getToken(req.session.adminToken)){
		res.status(200).json({
			code:1,
			message:'请重新登陆',
		})
	}else{
		server.musicDelete(JSON.parse(music_id))
		.then(results => {
			if(!results.affectedRows){ // 通过affectedID的值，判断sql语句是否操作成功
				res.status(200).json({
					code:3,
					message:'删除用户失败',
					data:results
				})
			}else{
				res.status(200).json({
					code:0,
					message:'删除用户成功',
					data:results
				})
			}
		})
	}
	
})

// 评论  ---------------------
router.get('/api/v1/comments',(req,res) => { // 获取评论
	let {offset,limit,token} = req.query
	
	if(!req.session.adminToken || token != md5.getToken(req.session.adminToken)){
		res.status(200).json({
			code:1,
			message:'fail',
		})
	}else{
		server.commentShow(JSON.parse(offset),JSON.parse(limit))
		.then(results => {
			res.status(200).json({
				code:0,
				message:'success',
				data:results
			})
		})
	}
})

router.put('/api/v1/comments',(req,res) => { // 修改评论
	let {comment_id,content,token} = req.body
	
	if(!req.session.adminToken || token != md5.getToken(req.session.adminToken)){
		res.status(200).json({
			code:1,
			message:'请重新登陆',
		})
	}else{
		server.commentUpdate(JSON.parse(comment_id),content)
		.then(results => {
			if(!results.affectedRows){ // 通过affectedID的值，判断sql语句是否操作成功
				res.status(200).json({
					code:2,
					message:'用户修改失败'
				})
			}else{
				res.status(200).json({
					code:0,
					message:'用户修改成功'
				})
			}
		})
	}

})

router.delete('/api/v1/comments',(req,res) => { // 删除评论
	let {comment_id,token} = req.body
	
	if(!req.session.adminToken || token != md5.getToken(req.session.adminToken)){
		res.status(200).json({
			code:1,
			message:'请重新登陆',
		})
	}else{
		server.commentDelete(JSON.parse(comment_id))
		.then(results => {
			if(!results.affectedRows){ // 通过affectedID的值，判断sql语句是否操作成功
				res.status(200).json({
					code:3,
					message:'删除用户失败'
				})
			}else{
				res.status(200).json({
					code:0,
					message:'删除用户成功'
				})
			}
		})
	}
	
})

module.exports = router

