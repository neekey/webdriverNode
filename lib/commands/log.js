/**
 输出自定义的log

 用法：this.log('我是log!')
 */
exports.command = function( msg, next )
{
    this._log.call( this, 'custom', msg );
    next();
};