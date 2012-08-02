/**
 不针对指定对象，而是直接按下键盘
 特殊符号代码请查阅：http://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/element/:id/value

 keys( keys, callback )
 @param {String|Array[String]} keys 需要按下的按键 'hello' | [ 'h', 'e', 'l', 'l', 'o' ]
 @param {Function} callback 其中ret.value为null
 */
exports.command = function( keys, callback)
{
    var self = this;

    self.elementKeys( keys, function(result){

        if (typeof callback === "function"){
            callback();
        }
    });
};

