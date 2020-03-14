# 项目
### 项目安装插件
-  express(构建服务器)
-  md5（加密）
-  mysql（连接服务器）
-  multer (处理form-data:值得注意的是multer使用postman的时候中文名会乱码)


### 项目启动
- `node app.js`

### 项目结构目录说明
| -- bin（服务器批处理文件）

| -- module（自定义模块）

| -- | -- db.js（服务器连接封装）

| -- | -- service.js（服务器连接封装）

| -- node_modules（第三方模块）

| -- public（静态资源）

| -- routes（路由文件）

| -- | -- all.route.js（路由处理文件）

| -- views（页面文件）

| -- app.js（项目入口）

| -- package.json（包管理文件）

| -- package-lock.json（包管理文件，详细说明）

| -- readme.md（项目说明文件）

### code含义
- 0
  - 代表正常
- 1
  - 未登陆
- 2
  - 数据库操作失败
- 3
  - 代码用户名存在（用于注册接口）

### 存在问题
- session过期后，拿不到session中的id，故不能判断用户提交过来的ID

