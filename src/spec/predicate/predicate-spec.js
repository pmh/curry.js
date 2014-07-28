var not$2615 = require('../../lib/predicate').not;
var and$2616 = require('../../lib/predicate').and;
var or$2617 = require('../../lib/predicate').or;
var isObject$2618 = require('../../lib/predicate').isObject;
var isArray$2619 = require('../../lib/predicate').isArray;
var isNumber$2620 = require('../../lib/predicate').isNumber;
var isRegExp$2621 = require('../../lib/predicate').isRegExp;
var isString$2622 = require('../../lib/predicate').isString;
var isNull$2623 = require('../../lib/predicate').isNull;
var isUndef$2624 = require('../../lib/predicate').isUndef;
var exists$2625 = require('../../lib/predicate').exists;
;
require('buster').spec.describe('Predicate', function () {
    require('buster').spec.describe('not', function () {
        ;
        require('buster').spec.it('returns the boolean inverse of it\'s arguments', function () {
            ;
            require('buster').assert(not$2615(true) === false, 'not(true)');
            require('buster').assert(not$2615(false) === true, 'not(false)');
        });
    });
    require('buster').spec.describe('and', function () {
        ;
        require('buster').spec.it('returns true if all the elements of a list are truthy', function () {
            ;
            require('buster').assert(and$2616([
                true,
                true
            ]) === true, 'and([true,  true ]) => true ');
            require('buster').assert(and$2616([
                true,
                false
            ]) === false, 'and([true,  false]) => false');
            require('buster').assert(and$2616([
                false,
                true
            ]) === false, 'and([false, true ]) => false');
            require('buster').assert(and$2616([
                false,
                false
            ]) === false, 'and([false, false]) => false');
            require('buster').assert(and$2616([
                '',
                true
            ]) === false, 'and([\'\',    true ]) => false');
            require('buster').assert(and$2616([
                'x',
                true
            ]) === true, 'and([\'x\',   true ]) => true ');
            require('buster').assert(and$2616([
                0,
                true
            ]) === false, 'and([0,     true ]) => false');
            require('buster').assert(and$2616([
                1,
                true
            ]) === true, 'and([1,     true ]) => true ');
        });
    });
    require('buster').spec.describe('or', function () {
        ;
        require('buster').spec.it('returns true if any of the elements of a list are truthy', function () {
            ;
            require('buster').assert(or$2617([
                true,
                true
            ]) === true, 'or([true,  true ]) => true ');
            require('buster').assert(or$2617([
                true,
                false
            ]) === true, 'or([true,  false]) => true ');
            require('buster').assert(or$2617([
                false,
                true
            ]) === true, 'or([false, true ]) => true ');
            require('buster').assert(or$2617([
                false,
                false
            ]) === false, 'or([false, false]) => false');
            require('buster').assert(or$2617([
                '',
                true
            ]) === true, 'or([\'\',    true ]) => true ');
            require('buster').assert(or$2617([
                '',
                false
            ]) === false, 'or([\'\',    false]) => false');
            require('buster').assert(or$2617([
                'x',
                true
            ]) === true, 'or([\'x\',   true ]) => true ');
            require('buster').assert(or$2617([
                0,
                true
            ]) === true, 'or([0,     true ]) => true ');
            require('buster').assert(or$2617([
                0,
                false
            ]) === false, 'or([0,     false]) => false');
            require('buster').assert(or$2617([
                1,
                true
            ]) === true, 'or([1,     true ]) => true ');
            require('buster').assert(or$2617([
                1,
                false
            ]) === true, 'or([1,     false]) => true ');
        });
    });
    require('buster').spec.describe('isObject', function () {
        ;
        require('buster').spec.it('returns true if it\'s argument is an object', function () {
            ;
            require('buster').assert(isObject$2618({}) === true, 'isObject({})  => true ');
            require('buster').assert(isObject$2618([]) === false, 'isObject([])  => false');
            require('buster').assert(isObject$2618(0) === false, 'isObject(0)   => false');
            require('buster').assert(isObject$2618(/x/) === false, 'isObject(/x/) => false');
            require('buster').assert(isObject$2618('x') === false, 'isObject(\'0\') => false');
            require('buster').assert(isObject$2618(0) === false, 'isObject(0)   => false');
        });
    });
    require('buster').spec.describe('isArray', function () {
        ;
        require('buster').spec.it('returns true if it\'s argument is an array', function () {
            ;
            require('buster').assert(isArray$2619([]) === true, 'isArray([])  => true ');
            require('buster').assert(isArray$2619({}) === false, 'isArray({})  => false');
            require('buster').assert(isArray$2619(0) === false, 'isArray(0)   => false');
            require('buster').assert(isArray$2619(/x/) === false, 'isArray(/x/) => false');
            require('buster').assert(isArray$2619('x') === false, 'isArray(\'x\') => false');
        });
    });
    require('buster').spec.describe('isNumber', function () {
        ;
        require('buster').spec.it('returns true if it\'s argument is a number', function () {
            ;
            require('buster').assert(isNumber$2620(0) === true, 'isNumber(0)   => true ');
            require('buster').assert(isNumber$2620([]) === false, 'isNumber([])  => false');
            require('buster').assert(isNumber$2620({}) === false, 'isNumber({})  => false');
            require('buster').assert(isNumber$2620(/x/) === false, 'isNumber(/x/) => false');
            require('buster').assert(isNumber$2620('x') === false, 'isNumber(\'x\') => false');
        });
    });
    require('buster').spec.describe('isRegExp', function () {
        ;
        require('buster').spec.it('returns true if it\'s argument is a regular expression', function () {
            ;
            require('buster').assert(isRegExp$2621(/x/) === true, 'isRegExp(/x/) => true ');
            require('buster').assert(isRegExp$2621(0) === false, 'isRegExp(0)   => false');
            require('buster').assert(isRegExp$2621([]) === false, 'isRegExp([])  => false');
            require('buster').assert(isRegExp$2621({}) === false, 'isRegExp({})  => false');
            require('buster').assert(isRegExp$2621('x') === false, 'isRegExp(\'x\') => false');
        });
    });
    require('buster').spec.describe('isString', function () {
        ;
        require('buster').spec.it('returns true if it\'s argument is a string', function () {
            ;
            require('buster').assert(isString$2622('x') === true, 'isString(\'x\') => true ');
            require('buster').assert(isString$2622(/x/) === false, 'isString(/x/) => false');
            require('buster').assert(isString$2622(0) === false, 'isString(0)   => false');
            require('buster').assert(isString$2622([]) === false, 'isString([])  => false');
            require('buster').assert(isString$2622({}) === false, 'isString({})  => false');
        });
    });
    require('buster').spec.describe('isNull', function () {
        ;
        require('buster').spec.it('returns true if it\'s argument is null', function () {
            ;
            require('buster').assert(isNull$2623(null) === true, 'isNull(null)    => true ');
            require('buster').assert(isNull$2623(void 0) === false, 'isNull(void(0)) => false');
            require('buster').assert(isNull$2623('x') === false, 'isNull(\'x\')     => false');
            require('buster').assert(isNull$2623(/x/) === false, 'isNull(/x/)     => false');
            require('buster').assert(isNull$2623(0) === false, 'isNull(0)       => false');
            require('buster').assert(isNull$2623([]) === false, 'isNull([])      => false');
            require('buster').assert(isNull$2623({}) === false, 'isNull({})      => false');
        });
    });
    require('buster').spec.describe('isUndef', function () {
        ;
        require('buster').spec.it('returns true if it\'s argument is undefined', function () {
            ;
            require('buster').assert(isUndef$2624(undefined) === true, 'isUndef(undefined)  => true ');
            require('buster').assert(isUndef$2624(null) === false, 'isUndef(null)       => false');
            require('buster').assert(isUndef$2624('x') === false, 'isUndef(\'x\')        => false');
            require('buster').assert(isUndef$2624(/x/) === false, 'isUndef(/x/)        => false');
            require('buster').assert(isUndef$2624(0) === false, 'isUndef(0)          => false');
            require('buster').assert(isUndef$2624([]) === false, 'isUndef([])         => false');
            require('buster').assert(isUndef$2624({}) === false, 'isUndef({})         => false');
        });
    });
    require('buster').spec.describe('exists', function () {
        ;
        require('buster').spec.it('returns true if it\'s argument isn\'t null or undefined', function () {
            ;
            require('buster').assert(exists$2625(undefined) === false, 'exists(undefined)  => false');
            require('buster').assert(exists$2625(null) === false, 'exists(null)       => false');
            require('buster').assert(exists$2625('x') === true, 'exists(\'x\')        => true ');
            require('buster').assert(exists$2625(/x/) === true, 'exists(/x/)        => true ');
            require('buster').assert(exists$2625(0) === true, 'exists(0)          => true ');
            require('buster').assert(exists$2625([]) === true, 'exists([])         => true ');
            require('buster').assert(exists$2625({}) === true, 'exists({})         => true ');
        });
    });
});