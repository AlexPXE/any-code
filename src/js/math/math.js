
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

const FERMAS_TEST_DEFAULT_CHECKS = INT_ONE;
const FERMAS_TEST_MIN_RANDOM_NUMBER = BIG_TWO;

const REGEXP_FOR_COMMONFRACTIONBIG_CLASS = /(\()|(\))|((?<=\(|^)[+\-]?\d+\/[+\-]?\d+)|(\d+\/[+\-]?\d+)|([\*:]|(?<=\d|\))[+\-])/g;    





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
        ['+', new Operators('+', 0, 'operator', 'sum')],
        ['-', new Operators('-', 0, 'operator', 'diff')],
        ['*', new Operators('*', 1, 'operator','mult')],
        ['/', new Operators('/', 1, 'operator', 'div')],
        [')', new Operators(')', 1, 'down')],
        ['(', new Operators('(', 1, 'up')],        
    ]);

    return str => {
        return op.has(str) ? op.get(str) : def;
    };
})();



class CommonFructionBig {
    constructor(commFr = '1/1') {
        
        let numerator = 0n;
        let denominator = 1n;

        Object.defineProperties(this, {
            numerator: {
                get() {
                    return numerator;
                },
                set(value) {
                    if(typeof value !== 'bigint') {
                        throw new Error('The numerator must be a bigint.');
                    }
                    
                    numerator = value;                
                }
            },

            denominator:{
                get() {
                    return denominator;
                },

                set(value) {
                    if(typeof value !== 'bigint') {
                        throw new Error('The denominator must be a bigint.');
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
                get() {
                    return `${numerator}/${denominator}`;
                },

                set(str) {
                    if(!/^-?\d+\/-?\d+$/.test(str)) {
                        throw new Error('The common fraction must be in the format of "numerator/denominator". Example: "1/2", "3/4", "5/6", etc.');    
                    }

                    this.numerator = BigInt(commFr.split('/')[0]);
                    this.denominator = BigInt(commFr.split('/')[1]);
                }
            },
            
        });

        if(typeof commFr) {

        }
        this.strFormat = commFr;        
    }

    [Symbol.toPrimitive](hint) {
        return this.strFormat;
    }

    static arithmeticParse(str) {

        let level = 0;                  
        const stack = new Llist();      

        const result = str.replace(/\s+/g, '')
            .match(REGEXP_FOR_COMMONFRACTIONBIG_CLASS);
            

        for(let value of result) {            
            const operator = checkOperator(value);
            
            switch(operator.type) {
                case 'up':
                    level++;
                    break;

                case 'down':
                    level--;
                    break;

                case 'operator':  

                
                  let prevpri = stack.tail.prev ? stack.tail.prev.value.priority : 0;                  
                  const curroperator = operator.methPriority(level + prevpri);
                  const currpri = curroperator.priority;

                  while(stack.length > 1) {                        

                        if(prevpri < currpri) {
                            break;
                        }

                        const y = stack.pop();
                        const op = stack.pop();
                        const x = stack.pop();
                        stack.push(x[op.method](y));

                        prevpri = stack.tail.prev ? stack.tail.prev.priority : 0;
                  }                 
                  
                  stack.push(curroperator);
                  break;  
                    
                default:
                    stack.push(new CommonFructionBig(value));
                   
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



    div(commFr = '0/1') {
        if(typeof commFr === 'string') {
            return new CommonFructionBig(commFr);
        }

        return this.mult(commFr.inverse());
    }

    mult(commFr = '0/1') {
        const {numerator: bX, denominator: bY} = commFr;
        const {numerator: aX, denominator: aY} = this;

        return new CommonFructionBig(`${aX * bX}/${aY * bY}`);
    }
    
   
    sum(commFr = '0/1') {
        if(typeof commFr === 'string') {
            return this.sum( new CommonFructionBig(commFr) );
        }

        const [{numerator: numerX, denominator: denomX}, {numerator: numerY, denominator: denomY}] = [this, commFr];        

        const lcm = lcmBig(denomX, denomY);
        const result = `${numerX * (lcm / denomX) + numerY * (lcm / denomY)}/${lcm}`;

        return new CommonFructionBig(result);
    }

    diff(commFr = '0/1') {
        if(typeof commFr === 'string') {
            return this.diff( new CommonFructionBig(commFr) );
        }

        return this.sum(commFr.mult('-1/1'));
    }
    

    reduce() {
        if(this.numerator === 0n) {            
            return new CommonFructionBig('0/1');
        }        

        const {numerator, denominator} = this;
        const gcd = gcdBig(numerator, denominator);        
        
        return new CommonFructionBig(`${numerator / gcd}/${denominator / gcd}`);
    }

    inverse() {
        if(this.numerator === 0) {
            return new CommonFructionBig('0/1');
        }

        return new CommonFructionBig(`${this.denominator}/${this.numerator}`);
    }
}

console.log(new CommonFructionBig('224/2').sum('2/2').reduce().strFormat);

function lcm(a, b) {    

    if(typeof a !== 'number' && typeof b !== 'number') {
        throw new Error('Function lcm() only accepts type of "number".');
    }

    return (a * b) / gcd(a, b);
}

/**
 * 
 * @param {bigint} a 
 * @param {bigint} b 
 * @returns {bigint}
 */
function lcmBig(a, b) {
    if(typeof a !== 'bigint' && typeof b !== 'bigint') {
        throw new Error('Function lcm() only accepts type of "number".');
    }
    return (a * b) / gcdBig(a, b);
}

function absBig(n) {
    return n < BIG_ZERO ? -n : n;
}



/**
 * The random(max, min) function returns a random integer between min and max (inclusive).
 * Wrks with positive numbers only.
 * 
 * @param {Number} max  The upper limit of the range including the value max.
 * @param {Number} min The lower limit of the range including the value min.
 * @returns {Number} A random integer between min and max (inclusive).
 * @throws {Error} If max > min.
 * @throws {Error} If max < 0 or min < 0.
 */
function random(min, max) {
    if(min > max) {
        throw new Error('max must be greater than min.');
    }

    if(min < 0 || max < 0) {
        throw new Error('min and max must be positive.');
    }

    return Math.floor( Math.random() * (max - min + 1)) + min;
}

/**
 * Fast pow algorithm, works with both positive and negative exponents. 
 * Works with [BigInt only](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).
 * 
 * @param {bigint} n Number thet will be raised to the power. BigInt only.
 * @param {bigint} p Exponent.Default value is BIG_TWO. BigInt only. 
 * @returns {bigint} Result.
 */ 
 function fastPowBig(n, p = BIG_TWO) {        

    if(typeof p !== 'bigint' && typeof n !== 'bigint') {        
        throw new Error('Function fastPowBig() only accepts BigInt numbers.');
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
 * The modExpBig() function is a cyclic function that calculates the modular exponentiation of a number. 
 * Works with [BigInt only](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).
 * 
 * @param {bigint} a Number thet will be raised to the power. BigInt only.
 * @param {bigint} p Exponent. BigInt only.
 * @param {bigint} m Modulus. BigInt only.
 * @returns {bigint} Result of modular exponentiation.
 * @throws {TypeError} If a, p or m are not bigint.
 * @throws {Error} If a, p or m is negative.
 */
function modExpBig(a, p, m) {   //modExpBig(12n, 12n, 13n)
    
    if(typeof a !== 'bigint' && typeof p !== 'bigint' && typeof m !== 'bigint') {        
        throw new TypeError('Function fastPowBig() only accepts BigInt numbers.');
    }

    if(a < 0n || p < 0n || m < 0n) {
        throw new Error('Function modExpBig() only accepts positive numbers.');
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
 * The modExpBigR() function is a recursive function that calculates the modular exponentiation of a number.
 * Works with [BigInt only](@linkhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).
 * If number, exponent and modulus are not positive, then returns uncorrect result.
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
 * The gcd() function calculates the [greatest common divisor of two numbers.](https://en.wikipedia.org/wiki/Greatest_common_divisor)
 * 
 * @param {number} n First number.
 * @param {number} m Second number.
 * @returns {number} gcd of n and m.
 */
function gcd(n, m) {
    return m === INT_ZERO ? n : gcd(m, n % m);
}

/**
 * The gcdBig() function calculates the [greatest common divisor of two numbers.](https://en.wikipedia.org/wiki/Greatest_common_divisor)
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
 * The eulert() function calculates the [Euler's totient function of a number.](https://en.wikipedia.org/wiki/Euler%27s_totient_function)
 * Implemended with a simple loop.
 * 
 * @param {number} n Number to calculate Euler's totient function.
 * @returns {number} Euler's totient function of n.
 */
function eulerst(n) {
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
 * The eulert() function calculates the [Euler's totient function of a number.](https://en.wikipedia.org/wiki/Euler%27s_totient_function)
 * Implemended with a simple loop. BigInt only. To work with integers, [use eulerst().]{@link module:math~eulerst}} 
 * 
 * @param {bigint} n Number to calculate Euler's totient function.
 * @returns {bigint} Euler's totient function of n.
 */
function eulerstBig(n) {
    let d = BIG_ZERO;
    for(let i = BIG_ONE; i < n; i++) {
        if ( gcdBig(n, i) === BIG_ONE) {           
            d++;
        }
    }
    return d;
}

/**
 * The randomBig() returns a random bigint number between min and max (iclusive of min, but not max). * 
 * 
 * @param {bigint} min Minimal value of the random number.
 * @param {bigint} max Maximal value of the random number.
 * @returns {bigint} Random bigint number.
 */
function randomBig(min, max) {    

    if(typeof max !== 'bigint' || max < BIG_ZERO) {        
        throw new Error('Function randomBig() only accepts positive numbers of type bigint.');
    }
    
    return BigInt( max.toString()
        .match(/\d{1,6}/g)
        .map((str, i) => {
            
            if(i > 0) {
                return '' + random(INT_ZERO, 10**(str.length) - 1);
            }        
            return '' + random( Number(min), +str - 1);
        })
        .join('')
    );       
}

/**
 * The fermaTestBig() calculates the Fermat's primality test of a number. Recursive version.
 * [a**(p-1) % p = 1 for all a < p.](https://en.wikipedia.org/wiki/Fermat_primality_test)
 * 
 * @param {bigint} p Estimated prime number.
 * @param {number} [checks = FERMAS_TEST_DEFAULT_CHECKS] Quantity of checks. The more checks, the more accurate the result, but the longer the calculation time.
 * @returns {boolean} True if the number is prime, false if the number is not prime.
 */
function fermaTestBigR(p, checks = FERMAS_TEST_DEFAULT_CHECKS) {
    const a = randomBig(FERMAS_TEST_MIN_RANDOM_NUMBER, p);   

    if(checks > 0) {
        return modExpBig(a, p - BIG_ONE, p) !== BIG_ONE ? false  : fermaTestBigR(p, --checks);

    }
    
    return true;
}

/**
 * The fermaTestBig() calculates the Fermat's primality test of a number. Loop version.
 * [a**(p-1) % p = 1 for all a < p.](https://en.wikipedia.org/wiki/Fermat_primality_test)
 * 
 * @param {bigint} p Estimated prime number.
 * @param {number} [checks = FERMAS_TEST_DEFAULT_CHECKS] Quantity of checks. The more checks, the more accurate the result, but the longer the calculation time.
 * @returns {boolean} True if the number is prime, false if the number is not prime.
 */
function fermaTestBig(p, checks = FERMAS_TEST_DEFAULT_CHECKS) {
    
    if(p < 2n) {
        return false;
    }

    for(let i = 0; i < checks; i++) {
        
        const a = randomBig(FERMAS_TEST_MIN_RANDOM_NUMBER, p);        
        if(modExpBig(a, p - 1n, p) !== 1n) {
            return false;
        }

    }
    return true;
}

/**
 * The gcdExBig() computes, in addition to the gcd, the coefficients **a** and **b** of the equation __a*x + b*y = gcd(x, y)__.
 * See [the Extended Euclidean algorithm](https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm) for more information.  
 * **BigInt only.**
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






console.log(CommonFructionBig.arithmeticParse('1/2 + ((-1/2) + 1/18 + 1/19) + (1/13 + (-2/7))').strFormat);



//console.log("(-12/-12+(-12/+3)*(-15/-4)".match( REGEXP_FOR_COMMONFRACTIONBIG_CLASS ) );
//console.log(test(48, 23));
//console.log('r', fermaTestBigBigR(21377n, 2));
//console.log('d', fermaTestBig(21377n, 2));
//console.log('e', eulerst(21377));


export { 
    random, 
    fastPowBig, 
    modExpBig, 
    modExpBigR, 
    gcd, 
    eulerst, 
    randomBig, 
    fermaTestBigR, 
    fermaTestBig,
    gcdExBig
};