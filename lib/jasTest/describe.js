var JasTest = require( '../jasTest' );

exports.command = function( desc, mainFun ){

    var currentSuite = this._currentSuite;
    var newSuit;

    // 无法在it中调用describe
    if( currentSuite && currentSuite.currentSpec ){

        throw new Error( 'function "describe" can not be called in function "it"' );

        return;
    }

    newSuit = new JasTest.Suite( desc, this._currentSuite );

    if( this._currentSuite === undefined ){
        this._suites.push( newSuit );
    }
    this._currentSuite = newSuit;

    mainFun();

    // 自动在结尾添加结束
    this.describeEnd( desc );
};