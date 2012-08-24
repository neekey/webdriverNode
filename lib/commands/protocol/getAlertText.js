/**
 获取当前显示的alert、confirm、prompt对话框的提示文字

 用法：this.getAlertText(function(ret){});

 其中ret.value为
    string
 */
exports.command = function( callback )
{

    var commandOptions =  {
        path: "/session/:sessionId/alert_text",
        method: "GET"
    };

    var self = this;
    var data = {};
    var callbackProxy = function ( result ){

        if (result.status == 0)
        {
            if (typeof callback === "function")
            {
                callback(result.value);
            }
        }
        else
        {
            if (typeof callback === "function")
            {
                callback(result);
            }
        }
    };

    this.executeProtocolCommand(
        commandOptions,
        self.proxyResponse(callbackProxy),
        data
    );
};