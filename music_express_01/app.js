const express = require('express')
const app = express()
const bodyParser = require('body-parser') // 引入bodyParser
const session = require('express-session') // 引入session
// 引入路由
const F_usersRegister = require('./routes/F_usersRegister') // 用户注册
const F_usersLogin = require('./routes/F_usersLogin')	// 用户登录
const F_musicsClick = require('./routes/F_musicsClick')	// 点击量排行
const F_musicsNew = require('./routes/F_musicsNew')	// 新歌排行（按时间）
const F_musicId = require('./routes/F_musicId')	// 获取歌曲（单首）
const F_commentsMusicId = require('./routes/F_commentsMusicId')	// 获取评论（单首歌曲下所有评论） 
const F_commentsAdd = require('./routes/F_commentsAdd')	// 新增评论
const A_adminsLogin = require('./routes/A_adminsLogin') // 管理员登录
const A_usersShow = require('./routes/A_usersShow') // 用户列表
const A_usersDelete = require('./routes/A_usersDelete') // 删除用户
const A_usersUpdate = require('./routes/A_usersUpdate') // 修改用户
const A_commentsShow = require('./routes/A_commentsShow') // 评论列表
const A_commentsUpdate = require('./routes/A_commentsUpdate') // 修改评论
const A_commentsDelete = require('./routes/A_commentsDelete') // 删除评论
const A_musicsAdd = require('./routes/A_musicsAdd') // 添加评论
const A_musicsShow = require('./routes/A_musicsShow') // 音乐列表
const A_musicsUpdate = require('./routes/A_musicsUpdate') // 修改音乐
const A_musicsDelete = require('./routes/A_musicsDelete') // 删除音乐


// 启动静态资源服务器，代理public文件夹和view文件夹
app.use('/public',express.static('public'))
app.use('/view',express.static('view'))

// 使用body-parser 中间件解析post数据
app.use(bodyParser.urlencoded({extended:false})) // application/x-www-form-urlencoded
app.use(bodyParser.json()) // appliation/json

// 使用session中间件
app.use(session({
	secret:'music',	// session加密字符串
	resave:true, //	每次请求是否重新设置session cookie
	saveUninitialized:false ,// 无论是否设置session数据,默认都会生成一个session钥匙
	cookie:{ // 设置session的有效时间
		maxAge: 1000 * 60 * 30
	}
}))


// 加载路由模块
app.use('/api/v1/users/register',F_usersRegister)
app.use('/api/v1/users/login',F_usersLogin)
app.use('/api/v1/musics/click',F_musicsClick)
app.use('/api/v1/musics/new',F_musicsNew)
app.use('/api/v1/musics',F_musicId)
app.use('/api/v1/comments',F_commentsMusicId)
app.use('/api/v1/comments',F_commentsAdd)
app.use('/api/v1/admins/login',A_adminsLogin)
app.use('/api/v1/users',A_usersShow)
app.use('/api/v1/users',A_usersUpdate)
app.use('/api/v1/users',A_usersDelete)
app.use('/api/v1/musics',A_musicsShow)
app.use('/api/v1/musics',A_musicsUpdate)
app.use('/api/v1/musics',A_musicsDelete)
app.use('/api/v1/musics',A_musicsAdd)
app.use('/api/v1/comments',A_commentsShow)
app.use('/api/v1/comments',A_commentsUpdate)
app.use('/api/v1/comments',A_commentsDelete)

app.listen(3000,() => {
	console.log(`服务器启动，监听3000端口`)
})