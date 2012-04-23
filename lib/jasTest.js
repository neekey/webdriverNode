/**
 * 模仿jasmine式的测试
 * 下面为Suit类和Spec类的定义
 */


var Suite = function ( desc, parentSuite ){

    this.description = desc;
    this.parent = parentSuite;
    this.specs = [];
    this.suites = [];
    this.isDone = false;
    this.currentSpec = undefined;


    if( this.parent && this.parent !== this ){

        console.log( desc );
        this.parent.suites.push( this );
    }
};

Suite.prototype = {

    addSpec: function ( desc, mainFun ){

        var newSpec = new Spec( desc, this, mainFun );
        this.specs.push( newSpec );
        this.currentSpec = newSpec;
    }
};

var Spec = function ( desc, suite, mainFun ){

    this.description = desc;
    this.suite = suite;
    this.items = [];
    this.isDone = false;
};

Spec.prototype = {

    addItem: function ( expectedValue, receivedValue, operation, result ){

        this.items.push( new TestItem( expectedValue, receivedValue, operation, result ) );
    }
};

var TestItem = function ( expectedValue, receivedValue, operation, result ){

    this.expected = expectedValue;
    this.received = receivedValue;
    this.operation = operation;
    this.result = result;
};

var Matcher = function ( actual, spec, ifNot ){

    this.actual = actual;
    this.expected = undefined;
    this.spec = spec;
    this.isNot = ifNot || false;
};

Matcher.prototype._getResult = function ( originResult, type ){

    var result;

    if( this.isNot ){

        result = !originResult;
    }
    else {

        result = originResult;
    }

    this.spec.addItem( this.expected, this.actual, type, result );

    return result;
};

Matcher.prototype.toBe = function(expected) {

    this.expected = expected;
    return this._getResult( this.actual === expected, 'toBe' );
};

/**
 * toEqual: compares the actual to the expected using common sense equality. Handles Objects, Arrays, etc.
 *
 * @param expected
 */
//Matcher.prototype.toEqual = function(expected) {
//
//    this.expected = expected;
//    return this._getResult( this.env.equals_(this.actual, expected) );
//};

/**
 * Matcher that compares the actual to the expected using a regular expression.  Constructs a RegExp, so takes
 * a pattern or a String.
 *
 * @param expected
 */
Matcher.prototype.toMatch = function(expected) {

    this.expected = expected;
    return this._getResult( new RegExp(expected).test(this.actual), 'toMatch' );
};

/**
 * Matcher that compares the actual to .undefined.
 */
Matcher.prototype.toBeDefined = function() {

    this.expected = undefined;
    return this._getResult( (this.actual !== undefined ), 'toBeDefined' );
};

/**
 * Matcher that compares the actual to .undefined.
 */
Matcher.prototype.toBeUndefined = function() {

    this.expected = undefined;
    return this._getResult( (this.actual === undefined ), 'toBeUndefined' );
};

/**
 * Matcher that compares the actual to null.
 */
Matcher.prototype.toBeNull = function() {

    this.expected = null;
    return this._getResult( (this.actual === null), 'toBeNull' );
};



exports.Suite = Suite;
exports.Spec = Spec;
exports.Matcher = Matcher;