// todo 貌似没有效果尝试修复

exports.command = function( text, callback )
{

    var commandOptions =  {
        path: "/session/:sessionId/alert_text",
        method: "POST"
    };

    var self = this;
    var data = { text: text || '' };

    this.executeProtocolCommand(
        commandOptions,
        self.proxyResponse(callback),
        data
    );
};