let express = require('express')
let router = express.Router()
let md5 = require('../module/md5.js')

let server = require('../module/bgServer.js') // 加载数据库处理程序

// 处理 multipart/form-data类型表单数据
let multer = require('multer')
let storage = multer.diskStorage({
	destination: function(req, file, cb) { // 解决不同格式不同存储文件夹问题
		// 接收文件输出路径
		if(file.fieldname === 'music_data'){
			cb(null, 'public/music')
		}
		else if(file.fieldname === 'lyric_data'){
			cb(null, 'public/lyric')
		}
		else if(file.fieldname === 'music_img_data'){
			cb(null, 'public/image')
		}
	},
	filename: function(req, file, cb) {
		let f = file.originalname
		cb(null, req.body.music_name + f.slice(f.indexOf('.'))) // 解决multer不支持中文文件夹问题
	}
})
let upload = multer({
	storage: storage // 上传文件存放路径
})
let musicUpload = upload.fields([{
	name: 'music_data'
}, {
	name: 'lyric_data'
}, {
	name: 'music_img_data'
}]) // 需要处理的数据


// 管理员 --------------
router.post('/api/v1/admins/login', (req, res) => {
	server.adminLogin(req.body.admin_account, req.body.admin_password)
		.then((results) => {
			if (results.length === 0) {
				res.status(200).json({
					code: 1,
					message: '用户密码不存在',
				})
			} else {
				// 登陆成功，设置session
				let token = md5.getToken(results[0].id.toString())
				req.session.adminToken = results[0].id.toString()
				res.status(200).json({
					code: 0,
					message: '登陆成功',
					data: results,
					token: token
				})
			}
		})
})

// 用户 --------------------
router.get('/api/v1/users', (req, res) => { // 获取用户
	let {
		offset,
		limit,
		token
	} = req.query

	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		res.status(200).json({
			code: 1,
			message: '请重新登陆',
		})
	} else {
		server.userShow(JSON.parse(offset), JSON.parse(limit))
			.then(results => {
				res.status(200).json({
					code: 0,
					message: '获取用户列表成功',
					data: results
				})
			})
	}
})

router.put('/api/v1/users', (req, res) => { // 修改用户
	let {
		user_id,
		user_account,
		user_password,
		email,
		token
	} = req.body

	console.log(req.body)

	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		res.status(200).json({
			code: 1,
			message: '请重新登陆',
		})
	} else {
		server.userUpdate(user_id, user_account, user_password, email)
			.then(results => {
				if (!results.affectedRows) { // 通过affectedRows的值，判断sql语句是否操作成功
					res.status(200).json({
						code: 2,
						message: '用户修改失败',
						data: results
					})
				} else {
					res.status(200).json({
						code: 0,
						message: '用户修改成功',
					})
				}
			})
	}

})

router.delete('/api/v1/users', (req, res) => { // 删除用户
	let {
		user_id,
		token
	} = req.body

	if (token != md5.getToken(req.session.adminToken)) {
		res.status(200).json({
			code: 1,
			message: '请重新登陆',
		})
	} else {
		server.userDelete(user_id)
			.then(results => {
				console.log(results)
				if (!results.affectedRows) { // 通过affectedRows的值，判断sql语句是否操作成功
					res.status(200).json({
						code: 2,
						message: '用户删除失败',
						data: results
					})
				} else {
					res.status(200).json({
						code: 0,
						message: '用户删除成功'
					})
				}
			})
	}

})

// 音乐 ---------------
router.get('/api/v1/musics', (req, res) => { // 获取音乐
	let {
		offset,
		limit,
		token
	} = req.query

	console.log(req.query)
	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		res.status(200).json({
			code: 1,
			message: '请重新登陆',
		})
	} else {
		server.musicShow(JSON.parse(offset), JSON.parse(limit)) // get获取的是字符串 需要转数字
			.then(results => {
				res.status(200).json({
					code: 0,
					message: '获取音乐列表成功',
					data: results
				})
			})
	}
})

router.post('/api/v1/musics', musicUpload, (req, res) => { // 添加音乐

	let music_url = req.files.music_data[0].path // 获取音乐路径
	let lyric_url = req.files.lyric_data[0].path // 获取评论路径 
	let music_img_url = req.files.music_img_data[0].path // 获取图片路径
	let {music_name,singer,token} = req.body
	
	if(!req.session.adminToken || token != md5.getToken(req.session.adminToken)){
		res.status(200).json({
			code:1,
			message:'请重新登陆',
		})
	}else{
		server.musicAdd(music_name,singer,music_url,lyric_url,music_img_url)
		.then(results => {
			if(!results.affectedRows){ // 通过affectedRows的值，判断sql语句是否操作成功
				res.status(200).json({
					code:2,
					message:'添加音乐失败',
					data:results
				})
			}else{
				res.status(200).json({
					code:0,
					message:'添加音乐成功',
					data:results
				})
			}
		})
	}

})

router.put('/api/v1/musics', (req, res) => { // 修改音乐
	let {
		music_id,
		music_name,
		singer,
		token
	} = req.body

	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		res.status(200).json({
			code: 1,
			message: '请重新登陆',
		})
	} else {
		server.musicUpdate(music_id, music_name, singer)
			.then(results => {
				if (!results.affectedRows) { // 通过affectedRows的值，判断sql语句是否操作成功
					res.status(200).json({
						code: 2,
						message: '修改音乐失败'
					})
				} else {
					res.status(200).json({
						code: 0,
						message: '修改音乐成功'
					})
				}
			})
	}

})

router.delete('/api/v1/musics', (req, res) => { // 删除音乐
	let {
		music_id,
		token
	} = req.body

	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		res.status(200).json({
			code: 1,
			message: '请重新登陆',
		})
	} else {
		server.musicDelete(music_id)
			.then(results => {
				if (!results.affectedRows) { // 通过affectedRows的值，判断sql语句是否操作成功
					res.status(200).json({
						code: 3,
						message: '删除音乐失败',
						data: results
					})
				} else {
					res.status(200).json({
						code: 0,
						message: '删除音乐成功',
						data: results
					})
				}
			})
	}

})

// 评论  ---------------------
router.get('/api/v1/comments', (req, res) => { // 获取评论
	let {
		offset,
		limit,
		token
	} = req.query

	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		res.status(200).json({
			code: 1,
			message: 'fail',
		})
	} else {
		server.commentShow(JSON.parse(offset), JSON.parse(limit))
			.then(results => {
				res.status(200).json({
					code: 0,
					message: '获取评论列表成功',
					data: results
				})
			})
	}
})

router.put('/api/v1/comments', (req, res) => { // 修改评论
	let {
		comment_id,
		content,
		token
	} = req.body

	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		res.status(200).json({
			code: 1,
			message: '请重新登陆',
		})
	} else {
		server.commentUpdate(comment_id, content)
			.then(results => {
				console.log('results:' + results)
				if (!results.affectedRows) { // 通过affectedRows的值，判断sql语句是否操作成功
					res.status(200).json({
						code: 2,
						message: '修改评论失败'
					})
				} else {
					res.status(200).json({
						code: 0,
						message: '修改评论成功'
					})
				}
			})
	}

})

router.delete('/api/v1/comments', (req, res) => { // 删除评论
	let {
		comment_id,
		token
	} = req.body

	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		res.status(200).json({
			code: 1,
			message: '请重新登陆',
		})
	} else {
		server.commentDelete(comment_id)
			.then(results => {
				if (!results.affectedRows) { // 通过affectedRows的值，判断sql语句是否操作成功
					res.status(200).json({
						code: 3,
						message: '删除评论失败'
					})
				} else {
					res.status(200).json({
						code: 0,
						message: '删除评论成功'
					})
				}
			})
	}

})

module.exports = router
