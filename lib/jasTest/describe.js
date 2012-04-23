var JasTest = require( '../jasTest' );

exports.command = function( desc, mainFun ){

    var currentSuite = this._currentSuite;
    var newSuit;

    // 无法在it中调用describe
    if( currentSuite && currentSuite.currentSpec ){

        throw new Error( 'function "describe" can not be called in function "it"' );

        return;
    }

    console.log( 'describe run: ', desc );
    console.log( 'current describe: ', this._currentSuite ? this._currentSuite.description : ' ');

    newSuit = new JasTest.Suite( desc, this._currentSuite );

    this._suites.push( newSuit );
    this._currentSuite = newSuit;

    mainFun();
    this.describeEnd( desc );
};