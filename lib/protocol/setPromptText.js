// todo 貌似没有效果尝试修复

exports.command = function( text, callback )
{

    var commandOptions =  {
        path: "/session/:sessionId/alert_text",
        method: "POST"
    };

    var self = this;
    var data = { text: text || '' };
    console.log( 'data', data );
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