/**
 不针对指定对象，而是直接按下键盘
 特殊符号代码请查阅：http://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/value

 elementIdKeys( keys, callback );
 @param {String|Array[String]} keys 需要按下的按键 'hello' | [ 'h', 'e', 'l', 'l', 'o' ]
 @param {Function} callback( ret ){} 其中ret.value为null

 注意：由于是按照顺序按下按键，因此会以此出发keydown和keyup事件，如果是!@等符号，则会先触发shift的按下，其他alt,ctr等类似
 */

var http = require("http");

exports.command = function( value, callback) 
{

    var commandOptions =  {
        path: "/session/:sessionId/keys",
        method: "POST"
    };
    
    var self = this;

    var data = { value: ( value instanceof Array ) ? value : 
        ( typeof value === 'string' ? value.split( '' ) : [ '' ] ) };
  
    self.executeProtocolCommand(
        commandOptions, 
        this.proxyResponse(callback), 
        data
    );
};
