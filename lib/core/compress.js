var Jsp = require("uglify-js").parser;
var Pro = require("uglify-js").uglify;
var util = require( 'util' );

/**
 * 对代码进行 non-acsii --> unicode
 * 如果出错，则直接返回源码
 *
 * @param origCode
 * @param {Function} log
 * @return {*}
 */
module.exports = function( origCode, log ){

    var finalCode;

    try {
        // parse code and get the initial AST.
        var ast = Jsp.parse( origCode, false );

        /**
         * 考虑到用户可能需要进行调试，因此不对代码进行压缩和变量缩减.
         * get a new AST with mangled names.
         *      ast = Pro.ast_mangle(ast);
         * get an AST with compression optimizations.
         *      ast = Pro.ast_squeeze(ast);
         */

        var genOpt = {
            ascii_only: true
        };

        finalCode = Pro.gen_code( ast, genOpt );
    }
    catch( e ){

        if( log ){
            log( 'Convert non-ASCII to Unicode fail: ' + e );
        }
        else {
            util.error( e );
        }
    }

    return finalCode || origCode;
};