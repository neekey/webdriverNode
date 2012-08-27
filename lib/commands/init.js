/**
 创建一个新的浏览器会话，可指定一些浏览器特性，返回创建的sessionId

 用法：
    1、this.init(desiredCapabilities, function(ret){});
    2、this.init(function(ret){});

 其中ret.value为
    Capabilities JSON Object

 注意：
    Capabilities JSON Object，desiredCapabilities是一个特殊对象（特殊格式的JSON），详细参看：http://code.google.com/p/selenium/wiki/JsonWireProtocol#Capabilities_JSON_Object
 */
exports.command = function( callback ){

    this.protocol.session( 'post', callback );
};