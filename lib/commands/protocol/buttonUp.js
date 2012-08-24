/**
 释放鼠标左键，每次mouseDown之后都必须调用一次这个方法

 用法：this.buttonUp(function(ret){});

 其中ret.value为null
 */
var http = require("http");

exports.command = function(callback) 
{
	var commandOptions =  {
		path: "/session/:sessionId/buttonup",
		method: "POST"
	}
	
	var data = {};
		
	this.executeProtocolCommand(
		commandOptions, 
		this.proxyResponseNoReturn(callback), 
		data
	);
};