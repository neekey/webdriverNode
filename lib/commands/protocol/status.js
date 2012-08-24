/**
 获取当前服务器状态。查询不一定会成功，可能返回空值。

 用法：this.status(function(ret){});

 其中ret.value为
 =======================================================
 字段             类型      描述
 build            object
 build.version    string    webdriver的一个通用的版本标签（如：“2.0rc3”）
 build.revision   string
 build.time       string    webdriver的编译时间
 os               object
 os.arch          string    目前的系统架构（如x86）。
 os.name          string    操作系统名称（如Windows XP、linux）
 os.version       string    操作系统版本（如5.1）
 */
var http = require("http");

exports.command = function(callback) 
{
	var commandOptions =  {
		path: "/status",
		method: "GET"
	}
	
	var data = {};
		
	this.executeProtocolCommand(
		commandOptions, 
		this.proxyResponse(callback), 
		data
	);
};