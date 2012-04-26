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