/**
 弹出alert对话框

 用法：this.alert('我是alert!')
*/
exports.command = function( text, callback )
{

    executeStr = 'alert("' + text + '");';
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