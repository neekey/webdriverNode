/**
 接受当前显示的警告对话框。通常，这是相当于在alert对话框上点击“确定”按钮。

 用法：this.acceptAlert(function(ret){});

 其中ret.value为null
 */
var http = require("http");

exports.command = function( callback )
{

    var commandOptions =  {
        path: "/session/:sessionId/accept_alert",
        method: "POST"
    };

    var self = this;

    var data =  {};

    this.executeProtocolCommand(
        commandOptions,
        self.proxyResponse(callback),
        data
    );
};