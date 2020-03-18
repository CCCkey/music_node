const express = require('express')
const router = express.Router()
const {jsonWrite} = require('../modules/jsonWrite')
const md5 = require('../modules/md5')
const session = require('express-session')
const {
	commentAdd,
	commentMusicId,
	commentShow,
	commentDelete,
	commentUpdate
} = require('../db/comment.db')

// 前台
router.get('/:music_id', (req, res) => { // 获取评论
	let {
		music_id
	} = req.params
	let {
		offset,
		limit
	} = req.query

	offset = JSON.parse(offset)
	limit = JSON.parse(limit)
	music_id = JSON.parse(music_id)

	commentMusicId(music_id,offset,limit)
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

router.post('/', (req, res) => { // 添加评论
	let {user_id,music_id,content,token} = req.body
	
	commentAdd(user_id,music_id,content)
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
router.get('/', (req, res) => { // 获取评论
	let {
		offset,
		limit,
		token
	} = req.query
	offset = JSON.parse(offset) // 转数字
	limit = JSON.parse(limit)
	
	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) { // 是否登陆
		jsonWrite(res,3)
		return
	}
	commentShow(offset,limit)
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

router.put('/', (req, res) => { // 修改评论
	let {
		comment_id,
		content,
		token
	} = req.body
	comment_id = JSON.parse(comment_id) // 转数字
	
	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		jsonWrite(res,3)
		return
	}
	commentUpdate(content,comment_id)
	.then(results => {
		res.status(200).json({
			code: 0,
			message: 'success'
		})
	})
	.catch(err => {
		jsonWrite(err)
	})
})

router.delete('/', (req, res) => { // 删除评论
	let {
		comment_id,
		token
	} = req.body
	comment_id = JSON.parse(comment_id) // 转数字
	
	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		jsonWrite(res,3)
		return
	}
	
	commentDelete(comment_id)
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