
"use strict";
import { Llist } from "../datastructures/llist.js";

/**
 * The math module contains functions for mathematical operations.
 * @module math
 */

const INT_ZERO = 0;
const INT_ONE = 1;
const INT_NINE = 9;
const INT_TEN = 10;
const BIG_ZERO = 0n;
const BIG_ONE = 1n;
const BIG_TWO = 2n;

const FERMAS_TEST_DEFAULT_CHECKS = 5;
const FERMAS_TEST_MIN_RANDOM_NUMBER = 2n;


const REGEXP_FOR_COMMONFRACTIONBIG_CLASS = /(\()|(\))|((?<=\(|^)[+\-]?\d+\/[+\-]?\d+)|(\d+\/[+\-]?\d+)|([\*:]|(?<=\d|\))[+\-])/g;

const ERRORS = {
    negativeValue: 'only accepts positive numbers.',
    numberType: 'only accepts type of "number".',
    bigIntType: 'only accepts type of "bigint".',
    randomMinMax: 'min must be less than max.',
    lessThanOne: 'only accepts numbers greater than 1.',
    lessThanTwo: 'only accepts numbers greater than 2.',
};

class Operators {
    constructor(operator = '', priority = 0, type = '', method = '') {
        this.name = operator;
        this.priority = priority;
        this.type = type;
        this.method = method;
    }

    methPriority(n = 0) {
        
        return {            
            priority: this.priority + n,
            method: this.method
        };
    }
}

const checkOperator = (function () {        

    const def = new Operators();
    
    const op = new Map([
        ['+', new Operators('+', 0, 'operator', 'add')],
        ['-', new Operators('-', 0, 'operator', 'sub')],
        ['*', new Operators('*', 1, 'operator','mult')],
        [':', new Operators('/', 1, 'operator', 'div')],
        [')', new Operators(')', 2, 'down')],
        ['(', new Operators('(', 2, 'up')],        
    ]);

    return str => {
        return op.has(str) ? op.get(str) : def;
    };
})();



class CommonFractionBig {

    static ERRORS = {
        'denomtype': 'The denominator must be a bigint.',
        'numtype': 'The numerator must be a bigint.',
        'strformat': 'The common fraction must be in the format of "numerator/denominator". Example: "1/2", "3/4", "5/6", etc.',
    };

    /**
     * The CommonFractionBig class represents a common fraction.
     * 
     * @param {string} commFr String representation of the common fraction. Example: "1/2", "3/4", "5/6", etc.
     */
    constructor(commFr = '0/1') {
        
        let numerator = 0n;
        let denominator = 1n;
        //TODO: Refactor this with private fields
        Object.defineProperties(this, {
            
            numerator: {
                /**
                 * Getter for the numerator.
                 * 
                 * @name numerator
                 * @returns {bigint}              
                 */
                get() {
                    return numerator;
                },
                /**
                 * Setter for the numerator.
                 * 
                 * @name numerator
                 * @param {bigint} value The numerator.
                 * @thows {TypeError} If the numerator is not a `bigint`.
                 */
                set(value) {
                    if(typeof value !== 'bigint') {
                        throw new TypeError(CommonFractionBig.ERRORS['numtype']);
                    }
                    
                    numerator = value;                
                }
            },

            denominator:{
                /**
                 * Getter for the denominator.
                 * @name denominator
                 * 
                 * @returns {bigint} The denominator.
                 */
                get() {
                    return denominator;
                },
                /**
                 * Setter for the denominator.
                 * @name denominator                  
                 *  
                 * @param {bigint} value The denominator of the common fraction.
                 * @throws {TypeError} If the denominator is not a `bigint`.
                 */
                set(value) {
                    if(typeof value !== 'bigint') {
                        throw new TypeError(CommonFractionBig.ERRORS['denomtype']);
                    }

                    if(value === BIG_ZERO) {
                        
                        numerator = BIG_ZERO;
                        denominator = BIG_ONE;

                    } else if(value < BIG_ZERO) {

                        numerator = -numerator;
                        denominator = -value;
                        
                    } else {
                        denominator = value;
                    }                    
                }
            },

            strFormat: {
                /**
                 * Get the string representation of the common fraction.
                 * @name strFormat
                 * 
                 * @returns {string} String representation of the common fraction. Example: "1/2", "3/4", "5/6", etc.
                 */
                get() {
                    return `${numerator}/${denominator}`;
                },
                /**
                 * Set the string representation of the common fraction.
                 * 
                 * @param {string} str String representation of the common fraction. Example: "1/2", "3/4", "5/6", etc.
                 * @throws {SyntaxError} If the string is not in the format of "numerator/denominator". Example: "1/2", "3/4", "5/6", etc.
                 */
                set(str) {
                    if(!/^-?\d+\/-?\d+$/.test(str)) {
                        throw new SyntaxError(CommonFractionBig.ERRORS['strformat']);    
                    }

                    this.numerator = BigInt(commFr.split('/')[0]);
                    this.denominator = BigInt(commFr.split('/')[1]);
                }
            },
            
        });
        
        this.strFormat = commFr;        
    }
    /**
     * 
     * @param {string} hint 
     * @returns {string} String representation common fraction. Example: "1/2", "3/4", "5/6", etc.
     */
    [Symbol.toPrimitive](hint) {
        return this.strFormat;
    }      

    /**
     * Parses the string representation of an arithmetic expression and returns its result.
     * Supports the following operators:  
     * *  `'+'` - plus;
     * * `'-'` - minus;
     * * `'*'` - multiplication;
     * *  `':'` - division;
     * * `'('` - left parenthesis;
     * *  `')'` - right parenthesis.
     * 
     * Example:  
     * *  `1/2 + 3/4`;
     * *  `(1/2 * (-3/4))`;
     * *  `1/2 - 3/4 * (5/6 + 1/7)` etc...
     * 
     * Not true:
     * *  `1/2 + 3 * -1*(5/6 + 1/7) + 5.8`;
     * *  `1 /   -1 *( 5 / 6 + 1/7) + 5.8`;
     * *  `90 ++ blabla...+*)(() + 0 )` etc...
     * 
     * 
     * @param {string} str String representation of the arithmetic expression.  
     * @returns {CommonFractionBig} Result. Instance of the CommonFractionBig class.
     * @tutorial CommonFractionBig
     */
    static arithmeticParse(str) {

        let level = 0;                  
        const stack = new Llist();      

        const result = str.replace(/\s+/g, '')
            .match(REGEXP_FOR_COMMONFRACTIONBIG_CLASS);
            
            


        for(let value of result) {            
            const operator = checkOperator(value);
            
            switch(operator.type) {
                case 'up':
                    level+=operator.priority;
                    break;

                case 'down':
                    level-=operator.priority;
                    break;

                case 'operator':                 
                  
                  const curroperator = operator.methPriority(level);
                  const currpri = curroperator.priority;

                  while(stack.length > 1) {                        
                        
                        if(stack.tail.prev.value.priority < currpri) {
                            break;
                        }

                        const y = stack.pop();
                        const op = stack.pop();
                        const x = stack.pop();
                        stack.push(x[op.method](y));
                        
                  }                  
                  
                  stack.push(curroperator);
                  break;  
                    
                default:                    
                    stack.push(new CommonFractionBig(value));
                   
            }
        }        

        while(stack.length > 1) {                                    

            const y = stack.pop();
            const op = stack.pop();
            const x = stack.pop();
            stack.push(x[op.method](y));            
        }        
      
        return stack.pop();
    }

    /**
     * Divide by argument.  
     * Example:  
     * * `instance.div('1/2')`;
     * * `instance.div(new CommonFractionBig('1/2'))`;
     * * `instance.div(anotherInstance)`.
     * 
     * @param {string|CommonFractionBig} commFr Divisor. String representation of the common fraction (Ex: `'1/2'`) or instance of the `CommonFractionBig` class.
     * @returns {CommonFractionBig} Quotient. Instance of the CommonFractionBig class.
     */
    div(commFr = '0/1') {
        if(typeof commFr === 'string') {
            return this.div(new CommonFractionBig(commFr));
        }
        
        return this.mult(commFr.inverse());
    }

    /**
     * Multiply by argument.
     * 
     * Example:  
     * * `instance.mult('1/2')`;
     * * `instance.mult(new CommonFractionBig('1/2'))`;
     * * `instance.mult(anotherInstance)`.
     * 
     * @param {string|CommonFractionBig} commFr Multiplier. String representation of the common fraction (Ex: `'1/2'`) or instance of the `CommonFractionBig` class.
     * @returns {CommonFractionBig} Product. Instance of the CommonFractionBig class.
     */
    mult(commFr = '0/1') {
        if(typeof commFr === 'string') {
            return this.mult(new CommonFractionBig(commFr));
        }       

        const {numerator: bX, denominator: bY} = commFr;
        // @ts-ignore
        const {numerator: aX, denominator: aY} = this;

        return new CommonFractionBig(`${aX * bX}/${aY * bY}`);
    }
    
    /**
     * Add argument.
     * 
     * Example:
     * * `instance.add('1/2')`;
     * * `instance.add(new CommonFractionBig('1/2'))`;
     * * `instance.add(anotherInstance)`.
     * 
     * @param {string|CommonFractionBig} commFr Addend. String representation of the common fraction (Ex: `'1/2'`) or instance of the `CommonFractionBig` class.
     * @returns {CommonFractionBig} Total. Instance of the CommonFractionBig class.
     */
    add(commFr = '0/1') {
        if(typeof commFr === 'string') {
            return this.add( new CommonFractionBig(commFr) );
        }
        
        const [{numerator: numerX, denominator: denomX}, {numerator: numerY, denominator: denomY}] = [this, commFr];

        const lcm = lcmBig(absBig(denomX), absBig(denomY));
        const result = `${numerX * (lcm / denomX) + numerY * (lcm / denomY)}/${lcm}`;

        return new CommonFractionBig(result);
    }

    /**
     * Subtract argument.  
     * 
     * Example:
     * * `instance.sub('1/2')`;
     * * `instance.sub(new CommonFractionBig('1/2'))`;
     * * `instance.sub(anotherInstance)`.
     * 
     * @param {string|CommonFractionBig} commFr Subtrahend. String representation of the common fraction (Ex: `'1/2'`) or instance of the `CommonFractionBig` class.
     * @returns {CommonFractionBig} Difference. Instance of the CommonFractionBig class.
     */
    sub(commFr = '0/1') {
        if(typeof commFr === 'string') {
            return this.sub( new CommonFractionBig(commFr) );
        }
        
        const tmp = commFr.mult('-1/1');       
        
        return this.add(tmp);
    }    

    /**
     * Reduce the fraction to lowest terms.
     * 
     * @returns {CommonFractionBig} Reduced fraction. Instance of the CommonFractionBig class.
     */
    reduce() {       

        const {numerator, denominator} = this;
        const gcd = gcdBig(absBig(numerator), absBig(denominator));        
        
        return new CommonFractionBig(`${numerator / gcd}/${denominator / gcd}`);
    }
    
    /**
     * Inverse the fraction.
     * 
     * @returns {CommonFractionBig} Inverse. Instance of the CommonFractionBig class.
     */
    inverse() {
        return new CommonFractionBig(`${this.denominator}/${this.numerator}`);        
    }
}


/**
 * Culculate the least common multiple of two numbers.
 * 
 * @param {number} a 
 * @param {number} b 
 * @returns {number} LCM of `a` and `b`.
 */
function lcm(a, b) {    

    if(typeof a !== 'number' && typeof b !== 'number') {
        throw new TypeError(`Function lcm() ${ERRORS.numberType}`);
    }
    if(a < 0 || b < 0) {
        throw new RangeError(`Function lcm() ${ERRORS.negativeNumber}`);
    }

    return (a * b) / gcd(a, b);
}

/**
 * Calculate the least common multiple of two numbers.
 * Works with [BigInt only](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).
 * For other types of numbers, use [`lcm()`]{@link module:math~lcm}
 * 
 * @param {bigint} a 
 * @param {bigint} b 
 * @returns {bigint} LCM of `a` and `b`.
 * @throws {RangeError} If one of the numbers is negative.
 * @throws {TypeError} If one of the numbers is not a `bigint`.
 */
function lcmBig(a, b) {
    if(typeof a !== 'bigint' && typeof b !== 'bigint') {
        throw new TypeError(`Function lcmBig() ${ERRORS.bigIntType}`);
    }

    if(a < 0n || b < 0n) {
        throw new RangeError(`Function lcmBig() ${ERRORS.negativeValue}`);
    }

    return (a * b) / gcdBig(a, b);
}

function absBig(n) {
    return n < BIG_ZERO ? -n : n;
}


/**
 * The `random(max, min)` function returns a random integer between min and max (inclusive).
 * Works with positive numbers only.
 * 
 * @param {Number} min The lower limit of the range including the value min.
 * @param {Number} max The upper limit of the range including the value max.
 * @returns {Number} A random integer between min and max (inclusive).
 * @throws {RangeError} If `max > min`.
 * @throws {RangeError} If `max < 0` or `min < 0`.
 */
function random(min, max) {
    if(min > max) {
        throw new RangeError(`Function random() ${ERRORS.randomMinMax}`);
    }

    if(min < 0 || max < 0) {
        throw new RangeError(`Function random() ${ERRORS.negativeValue}`);
    }

    return Math.floor( Math.random() * (max - min + 1)) + min;
}

/**
 * Fast pow algorithm.
 * Works with [BigInt only](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).
 * 
 * 
 * @param {bigint} n Number thet will be raised to the power. BigInt only.
 * @param {bigint} p Exponent.Default value is BIG_TWO. BigInt only. 
 * @returns {bigint} Result.
 * @throws {TypeError} If `p < 0`.
 * @throws {RangeError} If `p < 0` or `n < 0`.
 */ 

 function fastPowBig(n, p = BIG_TWO) {        

    if(typeof p !== 'bigint' && typeof n !== 'bigint') {        
        throw new TypeError(`Function fastPowBig() ${ERRORS.bigIntType}`);
    }

    if(n < 0 || p < 0) {
        throw new RangeError(`Function fastPowBig() ${ERRORS.negativeValue}`);
    }

    if(p === BIG_ZERO) {
        return BIG_ONE;
    }
    
    let tmp = BIG_ONE;
    let x = n;
        // if p is negative, then make it positive and remember the sign 
    const sign = (p < BIG_ZERO) && !!( p = (-p) );    

       //if pow equals 0 or 1, then skip the loop
    while(p > BIG_ONE) {
        
        if(p % BIG_TWO === BIG_ONE) {
            p = p - BIG_ONE;
            tmp *= x;                                    
        }
        p = p / BIG_TWO;
        x = x * x;
    }

    tmp *= x;
        //if p == 0, then return 1, else if sign is true (negative exponent), then return 1/tmp.
        //else return tmp
    return sign ? BIG_ONE / tmp : tmp;
}

/**
 * The `modExpBig()` function is a cyclic function that calculates the modular exponentiation of a number. 
 * Works with [BigInt only](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).
 * 
 * @param {bigint} a Number thet will be raised to the power. BigInt only.
 * @param {bigint} p Exponent. BigInt only.
 * @param {bigint} m Modulus. BigInt only.
 * @returns {bigint} Result of modular exponentiation.
 * @throws {TypeError} If `a`, `p` or `m` are not bigint.
 * @throws {RangeError} If `a`, `p` or `m` is negative.
 */
function modExpBig(a, p, m) {   //modExpBig(12n, 12n, 13n)
    
    if(typeof a !== 'bigint' && typeof p !== 'bigint' && typeof m !== 'bigint') {        
        throw new TypeError(`Function modExpBig() ${ERRORS.bigIntType}`);
    }

    if(a < 0n || p < 0n || m < 0n) {
        throw new RangeError(`Function modExpBig() ${ERRORS.negativeValue}`);
    }    
    
    let x = a;
    let exp = p;    
    let tmp = BIG_ONE;    

       //if exp equals 0 or 1, then skip the loop
    while(exp > BIG_ZERO) {       
     
        if(exp % BIG_TWO === BIG_ZERO) {
            exp = exp / BIG_TWO;
            x = x * x % m;
            continue; 
        }
        
        exp = exp - BIG_ONE;
        tmp = x * tmp % m;             
    }   

    return tmp;
}

/**
 * The `modExpBigR()` function is a recursive function that calculates the modular exponentiation of a number.
 * Works with [BigInt only](@linkhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).
 * If number exponent and modulus are not positive, then returns incorrect result.
 * 
 * @param {bigint} a Number thet will be raised to the power.
 * @param {bigint} p Exponent.
 * @param {bigint} m Modulus.
 * @returns {bigint} Result of modular exponentiation.
 */
 function modExpBigR(a, p, m) {
    if(p === BIG_ZERO) {
        return BIG_ONE;
    }
    
    if(p % BIG_TWO === BIG_ZERO) {       
        return modExpBigR(a * a % m, p / BIG_TWO, m);       
    }

    return (a * modExpBigR(a, p - BIG_ONE, m)) % m;
}

/**
 * The `gcd()` function calculates the [greatest common divisor of two numbers.](https://en.wikipedia.org/wiki/Greatest_common_divisor)
 * If number, exponent and modulus are not positive, then returns incorrect result.
 * 
 * @param {number} n First number.
 * @param {number} m Second number.
 * @returns {number} gcd of `n` and `m`.
 * 
 */
function gcd(n, m) {
    return m === INT_ZERO ? n : gcd(m, n % m);
}

/**
 * The `gcdBig()` function calculates the [greatest common divisor of two numbers.](https://en.wikipedia.org/wiki/Greatest_common_divisor)
 * If n or m is not positive, then returns incorrect result.
 * BigInt only. To work with integers, [use gcd().]{@link module:math~gcd}} 
 * 
 * @param {bigint} n First number.
 * @param {bigint} m Second number.
 * @returns {bigint} gcd of n and m.
 */
function gcdBig(n, m) {
    return m === BIG_ZERO ? n : gcdBig(m, n % m);
}


/**
 * The `eulert()` function calculates the [Euler's totient function of a number.](https://en.wikipedia.org/wiki/Euler%27s_totient_function)
 * Implemended with a simple loop. 
 * 
 * @param {number} n Number to calculate Euler's totient function.
 * @returns {number} Euler's totient function of `n`.
 * @throws {RangeError} If `n < 0`.
 */
function eulerst(n) {

    if(n < 0) {
        throw new RangeError(`Function eulerst() ${ERRORS.negativeValue}`);
    }

    let d = INT_ZERO;

    for(let i = INT_ONE; i < n; i++) {
        if ( gcd(n, i) === INT_ONE) {
            //console.log(` ${n},  ${i}`);
            d++;
        }
    }
    return d;
}
/**
 * The `eulertBig()` function calculates the [Euler's totient function of a number.](https://en.wikipedia.org/wiki/Euler%27s_totient_function)
 * Implemended with a simple loop. BigInt only. To work with integers, [use eulerst().]{@link module:math~eulerst}} 
 * 
 * @param {bigint} n Number to calculate Euler's totient function.
 * @returns {bigint} Euler's totient function of `n`.
 * @throws {TypeError} If n is not `bigint`.
 * @throws {RangeError} If `n < 0`.
 */
function eulerstBig(n) {

    if(typeof n !== 'bigint') {
        throw new TypeError(`Function eulerstBig() ${ERRORS.bigIntType}`);
    }

    if(n < 0n) {
        throw new RangeError(`Function eulerstBig() ${ERRORS.negativeValue}`);
    }
    
    let d = BIG_ZERO;

    for(let i = BIG_ONE; i < n; i++) {
        if ( gcdBig(n, i) === BIG_ONE) {           
            d++;
        }
    }
    return d;
}

/**
 * The randomBig() returns a random bigint number between min and max (iclusive of min, but not max).
 * If if `min` or `max` is not positive, then returns incorrect result.
 * 
 * @param {bigint} min Minimal value of the random number.
 * @param {bigint} max Maximal value of the random number.
 * @returns {bigint} Random `bigint` number.
 * @throws {TypeError} If min or max are not `bigint`.
 * @throws {RangeError} If `min` === `max`
 */

function randomBig(min, max) {    

    if(typeof max !== 'bigint') {        
        throw new TypeError('Function randomBig() only accepts bigint type.');
    }

    if(min === max || min > max || max < BIG_ZERO || min < BIG_ZERO) {
        throw new RangeError('Function randomBig() min and max are equal or min is greater than max or one of them is negative.');
    }
    
    const tmp = (max - min).toString().match(/\d{1,3}/g);
    let result = '' + random(0, +tmp[0] - 1);
    

    for(let i = 1; i < tmp.length; i++) {
        result += '' + random(0, 10**(tmp[i].length) - 1); //10**3 === 1000, 1000 - 1 === 999
    }

    return BigInt(result) + min;
}


/**
 * The fermaTestBig() calculates the Fermat's primality test of a number. Recursive version.
 * [a**(p-1) % p == 1 for all a < p.](https://en.wikipedia.org/wiki/Fermat_primality_test)
 * If `p` or `cheks` is not positive, then returns incorrect result.
 * 
 * @param {bigint} p Estimated prime number.
 * @param {number} [checks = FERMAS_TEST_DEFAULT_CHECKS] Quantity of checks. The more checks, the more accurate the result, but the longer the calculation time.
 * @returns {boolean} True if the number is prime, false if the number is not prime.
 * @throws {RangeError} If `checks` is not positive.
 */
function fermaTestBigR(p, checks = FERMAS_TEST_DEFAULT_CHECKS) {    
    const a = randomBig(FERMAS_TEST_MIN_RANDOM_NUMBER, p);       
    
    if(checks < 0) {
        throw new RangeError(`Function fermaTestBigR() ${ERRORS.negativeValue}`);
    }

    if(checks > 0) {
        return modExpBig(a, p - BIG_ONE, p) !== BIG_ONE ? false  : fermaTestBigR(p, --checks);

    }
    
    return true;
}

/**
 * The `fermaTestBig()` calculates the Fermat's primality test of a number. Loop version.
 * [a**(p-1) % p == 1 for all a < p.](https://en.wikipedia.org/wiki/Fermat_primality_test) * 
 * 
 * @param {bigint} p Estimated prime number.
 * @param {number} [checks = FERMAS_TEST_DEFAULT_CHECKS] Quantity of checks. The more checks, the more accurate the result, but the longer the calculation time.
 * @returns {boolean} True if the number is prime, false if the number is not prime.
 * @throws {TypeError} If `p` is not `bigint`.
 * @throws {RangeError} If `p < 0` or `checks < 0`.
 */
function fermaTestBig(p, checks = FERMAS_TEST_DEFAULT_CHECKS) {
    
    if(typeof p !== 'bigint') {
        throw new TypeError(`Function fermaTestBig() ${ERRORS.bigIntType}`);
    }

    if(p < BIG_ZERO || checks < 0) {
        throw new RangeError(`Function fermaTestBig() ${ERRORS.negativeValue}`);
    }

    if (checks === 0) {
        checks = FERMAS_TEST_DEFAULT_CHECKS;
    }

    if(p < BIG_TWO) {
        return false;
    }

    if(p === BIG_TWO) {
        return true;
    }

    for(let i = 0; i < checks; i++) {
        
        const a = randomBig(FERMAS_TEST_MIN_RANDOM_NUMBER, p);        
        if(modExpBig(a, p - BIG_ONE, p) !== BIG_ONE) {
            return false;
        }

    }
    return true;
}

/**
 * The gcdExBig() computes, in addition to the gcd, the coefficients `a` and `b` of the equation __a*x + b*y = gcd(x, y)__.
 * See [the Extended Euclidean algorithm](https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm) for more information.  
 * Only positive `bigint` are supported.
 * 
 * 
 * 
 * @param {bigint} a First number.
 * @param {bigint} b Second number.
 * @returns {bigint[]} Array with the coefficients a and b of the equation a*x + b*y = gcd(x, y) and the gcd of a and b ([x, y, gcd(a, b)]).
 */
function gcdExBig(a, b) {
    if (b === BIG_ZERO) {
        return [BIG_ONE, BIG_ZERO, a];
    }
    const [q, r] = [a / b, a % b];
    const [s, t, g] = gcdExBig(b, r);
    return [t, s - q * t, g];    
}

/**
 * The randomBits() returns a random bigint number with `bits` bits.
 * 
 * @param {number} bits Bit size of the random number.
 * @returns {Array} Array that represents a set of random bits.
 * @throws {RangeError} If `bits` is less than 1.
 */
function randomBits(bits = 1) {

    if(bits < 1) {
        throw new RangeError(`Function randomBits() ${ERRORS.lessThanOne}`);
    }

    let bitsArr = [1];
    for(let i = 1; i < bits; i++) {
        bitsArr.push(random(0, 1));
    }

    return bitsArr;
}


/**
 * The randomPrime() returns a random prime `bigint` with `bits` size.
 * Recursive version.
 * 
 * @param {number} bits bit size of the random prime number.
 * @returns {bigint} Random prime number.
 * @throws {RangeError} If `bits` is less than 2.
 */
function randomPrime(bits = 2) {
    if(bits < 2) {
        throw new RangeError(`Function randomPrime() ${ERRORS.lessThanTwo} Param 'bits' === ${bits}`);
    }

    let prime = BigInt('0b' + randomBits(bits).join(''));

    return fermaTestBig(prime) ? prime : randomPrime(bits);
}


export {    
    CommonFractionBig,   
    eulerst,     
    fastPowBig,          
    fermaTestBigR, 
    fermaTestBig,
    gcdExBig,
    gcd, 
    lcm,
    lcmBig,
    modExpBig, 
    modExpBigR,
    randomBig, 
    randomBits,
    randomPrime,
    random, 
};