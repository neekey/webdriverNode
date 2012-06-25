/**
 Determine an element's location on the screen once it has been scrolled into view.

 Note: This is considered an internal command and should only be used to determine an element's location for correctly generating native events.

 用法：this.elementIdLocationInView(id, function(ret){});

 其中ret.value为
     {
         'x': number,
         'y': number
     }
 */
var http = require("http");

exports.command = function(id, callback)
{
    var commandOptions =  {
        path: "/session/:sessionId/element/:id/location_in_view",
        method: "GET"
    };

    var requestOptions = commandOptions;
    requestOptions.path = requestOptions.path.replace(/:id/gi, id);

    var request = this.createRequest(requestOptions, this.proxyResponse(callback));
    var data = JSON.stringify({});
    request.write(data);
    request.end();
};
