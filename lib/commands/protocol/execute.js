/**
 在当前的frame中插入一段js脚本执行，并返回脚本执行后的结果。

 用法：
     1、this.execute('function(a,b,c){}', [a,b,c], function(ret){});
     2、this.execute('function(){}', function(ret){});

 其中ret.value为脚本返回的结果
 */
var http = require("http");

exports.command = function(script, args,  callback)
{

    var commandOptions =  {
        path: "/session/:sessionId/execute",
        method: "POST"
    };
    var data;
    if(typeof(args) == 'function'){
        callback = args;
        data = {"script": script, args: []};
    }else{
        data = {"script": script, 'args': args};
    }
    this.executeProtocolCommand(
        commandOptions,
        this.proxyResponse(callback),
        data
    );
};

