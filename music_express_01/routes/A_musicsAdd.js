let express = require('express')
let router = express.Router()
let mysql = require('mysql')
let multer = require('multer') // 处理 multipart/form-data类型表单数据
let md5 = require('../modules/md5')

/* mysql数据库 */
let pool = mysql.createPool({
	host:'127.0.0.1',
	user:'root',
	password:'root',
	database:'music'
})

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

router.post('/',(req,res) => {
	let {music_name,singer,token} = req.body
	let music_url = req.files.music_data[0].path // 获取音乐路径
	let lyric_url = req.files.lyric_data[0].path // 获取评论路径 
	let music_img_url = req.files.music_img_data[0].path // 获取图片路径
	
	if (!req.session.adminToken || token != md5.getToken(req.session.adminToken)) {
		res.status(200).json({
			code: 1,
			message: '请重新登陆',
		})
	} else {
		pool.getConnection((err,conn) => {
			if(err){
				throw err
			}
			/* sql语句和values参数 */
			let sql = 'INSERT INTO `music`(music_name, singer, music_url, lyric_url, music_img_url) values (?,?,?,?,?)'
			let values = [music_name,singer,music_url,lyric_url,music_img_url]  // 插入数据
			
			conn.query(sql,values,(err,results) => {
				conn.release();//释放数据库连接
				if(err){
					throw err
				}
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
		})	
	}
})

module.exports = router