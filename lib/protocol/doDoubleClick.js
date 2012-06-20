/**
 在当前鼠标位置双击鼠标左键（当前位置可由moveto设定）
 用法：this.doDoubleClick(function(){});
 callback函数参数：空
 */
var http = require("http");
exports.command = function(callback) 
{
	var commandOptions =  {
		path: "/session/:sessionId/doubleclick",
		method: "POST"
	};
	
	var requestOptions = commandOptions;

	var data = {};
		
	this.executeProtocolCommand(
		requestOptions, 
		this.proxyResponseNoReturn(callback), 
		data
	);
};
