/**
 在鼠标当前位置按住鼠标左键，请注意，在这个事件后面需要跟随鼠标release命令。click命令也会release鼠标。

 用法：this.buttonDown(function(ret){});

 其中ret.value为null
 */
var http = require("http");

exports.command = function(callback) 
{
	var commandOptions =  {
		path: "/session/:sessionId/buttondown",
		method: "POST"
	}
	
	var data = {};
		
	this._mods.communicate.request(
		commandOptions, 
		this.proxyResponseNoReturn(callback), 
		data
	);
};