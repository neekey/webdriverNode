/**
 * 该方法什么都不做，只是提供一个用户在同步执行队列中运行自定义代码的入口
 * @param next
 */
exports.command = function( next )
{
    next();
};

