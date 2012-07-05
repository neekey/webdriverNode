/**
 暂停指定毫秒

 用法：this.pause(1000, function(){});
 */
exports.command = function(milliseconds, callback)
{
	setTimeout(callback, milliseconds);
};

