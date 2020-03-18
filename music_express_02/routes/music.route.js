const express = require('express')
const router = express.Router()
const md5 = require('../modules/md5')
const multer = require('multer') // 处理 multiple/form-data
const session = require('express-session')
const {jsonWrite} = require('../modules/jsonWrite')
const {
	musicId,
	musicClick,
	musicNew,
	musicShow,
	musicUpdate,
	musicDelete,
	musicAdd
} = require('../db/music.db')

/* -------  multer 配置 -------- */
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
		/* console.log(file.originalname)
		let f = file.originalname
		cb(null, req.body.music_name + f.slice(f.indexOf('.'))) // 解决multer不支持中文文件夹问题 */
		cb(null,file.originalname)
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

/* ------------- 路由 -------------- */
// 前台
router.get('/click',(req,res) => { // 推荐音乐：点击量
	let {limit} = req.query
	limit = JSON.parse(limit) // 转数字
	
	musicClick(limit)
	.then(results => {
		res.status(200).json({
			code:0,
			message:'success',
			data:results
		})
	})
	.catch(err => {
		jsonWrite(res,err)
	})
})

router.get('/new',(req,res) => { // 推荐音乐：最新时间
	let {limit} = req.query
	limit = JSON.parse(limit) // 转数字
	
	musicNew(limit)
	.then(results => {
		res.status(200).json({
			code:0,
			message:'success',
			data:results
		})
	})
	.catch(err => {
		jsonWrite(err)
	})
})

router.get('/:id',(req,res) => { // 获取音乐：指定音乐

	let {id} = req.params
	id = JSON.parse(id) // 转数字
	
	musicId(id)
	.then(results => {
		res.status(200).json({
			code:0,
			message:'success',
			data:results
		})
	})
	.catch(err => {
		jsonWrite(res,err)
	})
})

// 后台
router.get('/',(req,res) => { // 获取音乐
	let {
		offset,
		limit,
		token
	} = req.query
	offset = JSON.parse(offset) // 转数字
	limit = JSON.parse(limit)
	
	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		jsonWrite(res,3)
		return
	}
	musicShow(offset,limit)
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

router.put('/',(req,res) => { // 修改音乐
	let {
		music_id,
		music_name,
		singer,
		token
	} = req.body
	music_id = JSON.parse(music_id) // 转数字
	
	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		jsonWrite(res,3)
		return
	}
	musicUpdate(music_id,music_name,singer)
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

router.delete('/',(req,res) => { // 删除音乐
	let {
		music_id,
		token
	} = req.body
	
	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		jsonWrite(res,3)
		return
	}
	console.log('delete')
	musicDelete(music_id)
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

router.post('/',(req,res) => { // 上传音乐
	let {music_name,singer,token} = req.body
	let music_url = req.files.music_data[0].path // 获取音乐路径
	let lyric_url = req.files.lyric_data[0].path // 获取评论路径 
	let music_img_url = req.files.music_img_data[0].path // 获取图片路径
	
	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		jsonWrite(res,3)
		return
	}
	musicAdd(music_name,singer,music_url,lyric_url,music_img_url)
	.then(results => {
		res.status(200).json({
			code:0,
			message:'success',
			data:results
		})
	})
	.catch(err => {
		jsonWrite(res,err)
	})
})

module.exports = router