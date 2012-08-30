var assert = require( 'assert' );
var TestHelper = require( '../testHelper' );
var _ = require( 'underscore' );
var client = require( '../../lib/core/webdriverNode').remote({
    desiredCapabilities: {
        browserName:"chrome"
    }
});

var pageInfo = {
    className: 'className',
    id: 'id',
    name: 'name',
    tagName: 'span',
    linkText: 'linkText',
    partialLinkText: 'partialLinkText'
};
var targetUrl = TestHelper.getPageUrl(__filename, pageInfo );

// Save all the elements found, and make sure they all different.
var elementIds = [];

client.init();
client.protocol.url( targetUrl);

describe( 'Protocol methods', function(){
    describe( '#element()', function(){
        it( 'class name', function( done ){
            client.protocol.elements( 'class name', pageInfo.className, function( ret ){

                assert.equal( 0, ret.status );
                assert.equal( true, _.isArray( ret.value ) );
                assert.equal( 3, ret.value.length );
                // $ Number( '2px' );
                // --> NaN
                // $ Number( '2' );
                // --> 2
                // & parseInt( '2px' );
                // --> 2
                ret.value.forEach(function( r ){
                    assert.equal( false, isNaN( Number( r.ELEMENT ) ) );
                    elementIds.push( r.ELEMENT );
                });

                done();
            });
        });

        it( 'id', function( done ){
            client.protocol.elements( 'id', pageInfo.id, function( ret ){

                assert.equal( 0, ret.status );
                assert.equal( true, _.isArray( ret.value ) );
                assert.equal( 3, ret.value.length );
                ret.value.forEach(function( r ){
                    assert.equal( false, isNaN( Number( r.ELEMENT ) ) );
                    elementIds.push( r.ELEMENT );
                });

                done();
            });
        });

        it( 'name', function( done ){
            client.protocol.elements( 'name', pageInfo.name, function( ret ){

                assert.equal( 0, ret.status );
                assert.equal( true, _.isArray( ret.value ) );
                assert.equal( 3, ret.value.length );
                ret.value.forEach(function( r ){
                    assert.equal( false, isNaN( Number( r.ELEMENT ) ) );
                    elementIds.push( r.ELEMENT );
                });

                done();
            });
        });

        it( 'tag name', function( done ){
            client.protocol.elements( 'tag name', pageInfo.tagName, function( ret ){

                assert.equal( 0, ret.status );
                assert.equal( true, _.isArray( ret.value ) );
                assert.equal( 3, ret.value.length );
                ret.value.forEach(function( r ){
                    assert.equal( false, isNaN( Number( r.ELEMENT ) ) );
                    elementIds.push( r.ELEMENT );
                });

                done();
            });
        });

        it( 'link text', function( done ){
            client.protocol.elements( 'link text', pageInfo.linkText, function( ret ){

                assert.equal( 0, ret.status );
                assert.equal( true, _.isArray( ret.value ) );
                assert.equal( 3, ret.value.length );
                ret.value.forEach(function( r ){
                    assert.equal( false, isNaN( Number( r.ELEMENT ) ) );
                    elementIds.push( r.ELEMENT );
                });

                done();
            });
        });

        it( 'partial link text', function( done ){
            client.protocol.elements( 'partial link text', pageInfo.partialLinkText, function( ret ){

                assert.equal( 0, ret.status );
                assert.equal( true, _.isArray( ret.value ) );
                assert.equal( 3, ret.value.length );
                ret.value.forEach(function( r ){
                    assert.equal( false, isNaN( Number( r.ELEMENT ) ) );
                    elementIds.push( r.ELEMENT );
                });

                done();
            });
        });

        it( 'end', function(done){
            client.end(function(){
                done();
            });
        });
    });
});
