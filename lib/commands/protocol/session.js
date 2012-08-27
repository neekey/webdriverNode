/**
 获取当前浏览器会话的信息
 或者删除这个会话（关闭浏览器窗口）

 用法：
     1、this.session(function(ret){});//获取
     2、this.session('get', function(ret){});//同上
     3、this.session('delete', function(ret){});//删除

 其中ret.value为
     Capabilities JSON Object

 注意：
    Capabilities JSON Object，desiredCapabilities是一个特殊对象（特殊格式的JSON），详细参看：http://code.google.com/p/selenium/wiki/JsonWireProtocol#Capabilities_JSON_Object
 */
var Path = require( 'path' );
var Filename = Path.basename( __filename, Path.extname( __filename ) );

exports.command = function(doWhat, callback)
{
    // Default to get current session info.
    if (typeof doWhat == "function"){
        callback = doWhat;
        doWhat = "get";
    }

    doWhat = doWhat.toLowerCase();

    var optionsToUse = undefined;
    var data = undefined;
    var self = this;

    var commandOptionsGet =  {
        path: '/session/:sessionId',
        method: 'GET'
    };

    var commandOptionsDelete =  {
        path: '/session/:sessionId',
        method: 'DELETE'
    };

    var commandOptionsPost = {
        path: '/session',
        method: 'POST'
    };

    switch( doWhat ){
        // Retrieve the capabilities of the specified session.
        case 'get':
            optionsToUse = commandOptionsGet;
            break;
        // Create a new session. The server should attempt to create a session that most closely matches the desired and required capabilities.
        // Required capabilities have higher priority than desired capabilities and must be set for the session to be created.
        case 'post':
            optionsToUse = commandOptionsPost;
            data =  {
                desiredCapabilities: self._config[ 'desiredCapabilities' ],
                sessionId: null
            };
            break;
        // Delete the session.
        case 'delete':
            optionsToUse = commandOptionsDelete;
            break;
        default:
            this._mods.log.error( "The session command need either a 'delete' or 'get' attribute to know what to do. example: client.session('get', callback) to get the capabilities of the session." );
            process.exit( 1 );
    }

    this._mods.communicate.request(
        optionsToUse,
        {
            callback: callback,
            commandName: Filename,
            resultHandler: (function( type ){
                return function( resObj ){

                    // When creating an new session.
                    if( self._data.sessionId === undefined ){
                        if( type === 'post' ){
                            // A 303 See Other redirect to /session/:sessionId, where :sessionId is the ID of the newly created session.
                            var location = resObj.response.headers.location;
                            self._data.sessionId = Path.basename( location );
                            self._mods.log.other( 'Created an new session, sessionID: %s', self._data.sessionId );
                        }
                        else {
                            self._mods.log.error( 'An unexpected error occurs: missing session ID when using method `session` but not to create an new session!' )
                        }
                    }

                    return resObj.result;
                }
            })( doWhat )
        }
    );
};