var JasTest = require( './jasTest' );
var Matcher = JasTest.Matcher;

module.exports = function( host, plugin ){


    plugin._suites = [];
    plugin._currentSuite = undefined;

    /**
     * 和jasmine的expect类似，支持 expect( value ).not.toBe( value );
     * @param actual
     * @return {*}
     */
    host.expect = function ( actual ){

        var currentSuite = this._currentSuite;
        var currentSpec = currentSuite ? currentSuite.currentSpec : undefined;

        if( !currentSpec ){

            throw new Error( 'function "expect" must be called in function "it"! ' );
        }

        var newMatcher = new Matcher( actual, currentSpec );
        newMatcher.not = new Matcher( actual, currentSpec, true );

        return newMatcher;
    };

    /**
     * 获取所有的测试结果
     * { summary: { item: 9, itemFailure: 1, spec: 3, specFailure: 1, suite: 3, suiteFailure: 1 }, list: [] }
     */
    plugin.getTestResult = function ( suites ){

        var resultList = [];
        var result = {
            summary: undefined,
            list: undefined
        };
        var name;

        suites = suites || this._suites;

        suites.forEach( function ( suite ){

            resultList.push( suite.getResult() );

            if( result.summary === undefined ){

                result.summary = {};

                for( name in suite.summary ){

                    result.summary[ name ] = suite.summary[ name ];
                }
            }
            else {

                for( name in suite.summary ){

                    result.summary[ name ] += suite.summary[ name ];
                }
            }

            result.summary.suite++;
        });

        result.list = resultList;

        return result;
    };
};