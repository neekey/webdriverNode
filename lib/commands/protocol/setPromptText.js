/**
 发送按键到一个javascript产生的prompt对话框(此方法可能有问题，需要测试！)

 用法：this.setPromptText(text, function(ret){});

 其中ret.value为null
 */
exports.command = function( text, callback )
{

    var commandOptions =  {
        path: "/session/:sessionId/alert_text",
        method: "POST"
    };

    var self = this;
    var data = { text: text || '' };

    this._mods.communicate.request(
        commandOptions,
        self.proxyResponse(callback),
        data
    );
};