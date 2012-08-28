/**
 * 用于测试的静态服务器
 */
var static = require('node-static');
var serverConfig = require( './serverConfig' );

// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server;

require('http').createServer(function (request, response) {

    request.addListener('end', function () {
        // Serve files!
        file.serve(request, response);
    });
}).listen( Number( serverConfig.port ) );
console.log( 'test server is now listen port ' + serverConfig.port );