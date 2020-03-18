let jsonWrite = (res,err) => {
	if(err === 1){
		res.status(500).json({
			code: 1,
			message: '服务器错误',
		})
	}
	else if(err ===  2){
		res.status(200).json({
			code: 2,
			message: '用户名已存在',
		})
	}
	else if(err === 3){
		res.status(200).json({
			code: 3,
			message: '未登陆',
		})
	}
}

module.exports = {
	jsonWrite
}