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