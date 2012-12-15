/**
 * 获取当前frame|page的title值
 * @param {String} url
 * @param {Function} [callback](ret)
 * @return {Object} `{ value: 'url' }`
 */

exports.command = function( url, callback ){

    if (typeof url === 'function' ){
        callback = url;
        url = undefined;
    }

    this.execute(function( u ){
        if( u ){
            window.location.href = u;
        }
        else {
            u = window.location.href;
        }
        return u;
    }, [ url ], function( ret ){
        callback( ret );
    });
};