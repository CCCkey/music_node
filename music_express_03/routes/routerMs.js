let express = require('express')
let router = express.Router()
let md5 = require('../module/md5.js')

let server = require('../module/serverMs.js') // 加载数据库处理程序

// 用户
router.post('/api/v1/users/register',(req,res) => { // 注册
	let {user_account,user_password,email} = req.body
	
	server.userRegister(user_account,user_password,email)
	.then(results => {
		res.status(200).json({
			code:0,
			message:'用户注册成功'
		})
	})
	.catch(err => {
		res.status(200).json({
			code:3,
			message:'用户名存在'
		})
	})
})

router.post('/api/v1/users/login',(req,res) => { // 登录
	let {user_account,user_password,email} = req.body
	
	server.userLogin(user_account, user_password)
		.then((results) => {
			if (results.length === 0) {
				res.status(200).json({
					code: 1,
					message: '用户密码不存在',
				})
			} else {
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

// 音乐
router.get('/api/v1/musics/click',(req,res) => { // 点击排行
	let {limit} = req.query
	console.log('click')
	
	server.musicTopClick(JSON.parse(limit)) // get参数需要转数字
	.then(results => {
		res.status(200).json({
			code:0,
			message:'获取推荐音乐列表成功',
			data:results
		})
	})
})

router.get('/api/v1/musics/new',(req,res) => { // 新歌排行
	let {limit} = req.query
	
	server.musicTopNew(JSON.parse(limit)) // get参数需要转数字
	.then(results => {
		res.status(200).json({
			code:0,
			message:'获取新歌列表成功',
			data:results
		})
	})
})

router.get('/api/v1/musics/:id',(req,res) => { // 获取音乐（单个）
	let {id} = req.params
	
	server.musicId(JSON.parse(id)) // 转数字
	.then(results => {
		if(results.length == 0){
			res.status(200).json({
				code:2,
				message:'查询音乐失败'
			})
		}else{
			res.status(200).json({
				code:0,
				message:'查询音乐成功',
				data:results
			})
		}
	})
})

// 评论
router.get('/api/v1/comments/:music_id',(req,res) => { // 获取评论
	let {music_id} = req.params
	let {offset,limit} = req.query
	
	server.commentMs(JSON.parse(music_id),JSON.parse(offset),JSON.parse(limit))
	.then(results => {
		if(results.data.length == 0){
			res.status(200).json({
				code:2,
				message:'获取评论列表失败'
			})
		}else{
			res.status(200).json({
				code:0,
				message:'获取评论列表成功',
				data:results
			})
		}
	})
})

router.post('/api/v1/comments/',(req,res) => { // 添加评论
	let {user_id,music_id,content,token} = req.body
	
	if(!req.session.userToken || token != md5.getToken(req.session.userToken)){
		res.status(200).json({
			code: 1,
			message: '请重新登陆',
		})
	}
	else {
		server.commentAdd(music_id,user_id,content)
		.then(results => {
			if(results.affectedRows != 1){
				res.status(200).json({
					code:0,
					message:'添加评论失败',
					data:results
				})
			}else{
				res.status(200).json({
					code:0,
					message:'添加评论成功',
					data:results
				})
			}
		})
	}
})

module.exports = router