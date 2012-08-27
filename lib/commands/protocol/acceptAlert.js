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

    this._mods.communicate.request(
        commandOptions,
        {
            data: {},
            callback: callback,
            commandName: 'acceptAlert',
            resultHandler: function( resObj ){
//                {
//                    response: response,
//                        data: data,
//                    result: result
//                }
                return resObj.result;
            }
        }
    );
};