const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const router = require('./routes/bgRouter.js') // 引入路由

// 启动静态资源服务器，代理public文件夹以views文件夹
app.use('/public',express.static('public'))
app.use(express.static('view'))

// 使用body-parser中间件解析post数据
app.use(bodyParser.urlencoded({extended:false})) // application/x-www-form-urlencoded
app.use(bodyParser.json()) // application/json

// 使用session中间件
app.use(session({
	secret:'music', // session加密字符串
	resave:true,	// 每次请求是否重新设置session cookie
	saveUninitialized:false, // 是否保存未初始化session
	cookie:{ // 设置session的有效时间
		maxAge:1000 * 60 * 30
	}
}))

// 允许跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})


app.use(router) // 加载路由模块


app.listen(3000,() => {
	console.log(`服务器启动,监听3000端口`)
})