const express = require('express')
const app = express()
const bodyParser = require('body-parser') // 解决post参数问题
const session = require('express-session')
const admin = require('./routes/admin.route')
const user = require('./routes/user.route')
const music = require('./routes/music.route')
const comment = require('./routes/comment.route')

// 启动静态服务器
app.use('public',express.static('public'))
app.use('views',express.static('view'))

// 使用body-parser 中间件解析post数据
app.use(bodyParser.urlencoded({extended:false})) //application/x-www-form-urlencoded
app.use(bodyParser.json()) // application/json

// 使用session中间件
app.use(session({
	secret:'music', // session加密字符串
	resave:true ,// 每次请求是否重新设置session
	saveUninitialized:false, // 无论是否设置session都生出session
	cookie:{ // 设置session的有效时间
		maxAge: 1000 * 60 * 30
	}
}))

// 加载路由
app.use('/api/v1/admins',admin) // admin模块
app.use('/api/v1/users',user) // user模块
app.use('/api/v1/musics',music) // music模块
app.use('/api/v1/comments',comment) // comment模块


app.listen(3000,() => {
	console.log(`服务器启动，监听3000端口`)
})