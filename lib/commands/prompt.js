/**
 弹出prompt对话框（基于execute方法）

 用法：this.prompt('this is text', function(ret){
    ret === 'this is text';
 });

 */
exports.command = function( text, callback )
{

    executeStr = 'prompt("' + text + '");';
    this.execute( executeStr, function ( result ){

        if (result.status == 0)
        {
            if (typeof callback === "function")
            {
                callback(result.value);
            }
        }
        else
        {
            if (typeof callback === "function")
            {
                callback(result);
            }
        }
    });
};