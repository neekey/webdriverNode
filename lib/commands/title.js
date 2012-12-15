/**
 * 获取当前frame|page的title值
 * @param {Function} [callback](ret)
 * @return {Object} `{ value: 'title' }`
 */

exports.command = function( callback ){

    this.execute(function(){
        return document.title;
    }, null, function( ret ){
        callback( ret );
    });
};