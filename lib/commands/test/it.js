var JasTest = require( '../../plugins/jasTest/jasTest' );

exports.command = function( desc, mainFun ){

    var jasTest = this._plugins.jasTest;
    var currentSuite = this._currentSuite;
    var currentSpec;

    // 无法在describe之外调用it
    if( !currentSuite ){

        throw new Error( 'function "it" can only be called in function "describe"' );
    }
    else {

        currentSpec = jasTest.currentSpec;

        // it 无法嵌套
        if( currentSpec ){

            throw new Error( 'function "it" can not be called in function "it"' );
        }
    }

    currentSuite.addSpec( desc, currentSuite );

    mainFun();

    // 自动在结尾添加结束
    this.itEnd();
};