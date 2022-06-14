
"use strict";

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


/**
 * The random(max, min) function returns a random integer between min and max (inclusive).
 * 
 * @param {Number} max  The upper limit of the range.
 * @param {Number} min The lower limit of the range.
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
 function fastPow(n, p = BIG_TWO) {        

    if(typeof p !== 'bigint' && typeof n !== 'bigint') {        
        throw new Error('Function fastPow() only accepts BigInt numbers.');
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
 * The modExp() function is a cyclic function that calculates the modular exponentiation of a number. 
 * Works with [BigInt only](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).
 * 
 * @param {bigint} a Number thet will be raised to the power. BigInt only.
 * @param {bigint} p Exponent. BigInt only.
 * @param {bigint} m Modulus. BigInt only.
 * @returns {bigint} Result of modular exponentiation.
 * @throws {TypeError} If a, p or m are not bigint.
 * @throws {Error} If a, p or m is negative.
 */
function modExp(a, p, m) {   //modExp(12n, 12n, 13n)
    
    if(typeof a !== 'bigint' && typeof p !== 'bigint' && typeof m !== 'bigint') {        
        throw new TypeError('Function fastPow() only accepts BigInt numbers.');
    }

    if(a < 0n || p < 0n || m < 0n) {
        throw new Error('Function modExp() only accepts positive numbers.');
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
 * The modExpR() function is a recursive function that calculates the modular exponentiation of a number.
 * Works with [BigInt only](@linkhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).
 * If number, exponent and modulus are not positive, then returns uncorrect result.
 * 
 * @param {bigint} a Number thet will be raised to the power.
 * @param {bigint} p Exponent.
 * @param {bigint} m Modulus.
 * @returns {bigint} Result of modular exponentiation.
 */
 function modExpR(a, p, m) {
    if(p === BIG_ZERO) {
        return BIG_ONE;
    }
    
    if(p % BIG_TWO === BIG_ZERO) {       
        return modExpR(a * a % m, p / BIG_TWO, m);       
    }

    return (a * modExpR(a, p - BIG_ONE, m)) % m;
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
 * The gcd() function calculates the [greatest common divisor of two numbers.](https://en.wikipedia.org/wiki/Greatest_common_divisor)
 * BigInt only. To work with integers, [use gcd().]{@link module:math~gcd}} 
 * 
 * @param {bigint} n First number.
 * @param {bigint} m Second number.
 * @returns {bigint} gcd of n and m.
 */
function gcdBigInt(n, m) {
    return m === BIG_ZERO ? n : gcdBigInt(m, n % m);
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
function etBigInt(n) {
    let d = BIG_ZERO;
    for(let i = BIG_ONE; i < n; i++) {
        if ( gcdBigInt(n, i) === BIG_ONE) {           
            d++;
        }
    }
    return d;
}

/**
 * The randomBigInt() returns a random bigint number between min and max (iclusive of min, but not max). * 
 * 
 * @param {bigint} min Minimal value of the random number.
 * @param {bigint} max Maximal value of the random number.
 * @returns {bigint} Random bigint number.
 */
function randomBigInt(min, max) {    

    if(typeof max !== 'bigint' || max < BIG_ZERO) {        
        throw new Error('Function randomBigInt() only accepts positive numbers of type bigint.');
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
 * The fermaTestR() calculates the Fermat's primality test of a number. Recursive version.
 * [a**(p-1) % p = 1 for all a < p.](https://en.wikipedia.org/wiki/Fermat_primality_test)
 * 
 * @param {bigint} p Estimated prime number.
 * @param {number} [checks = FERMAS_TEST_DEFAULT_CHECKS] Quantity of checks. The more checks, the more accurate the result, but the longer the calculation time.
 * @returns {boolean} True if the number is prime, false if the number is not prime.
 */
function fermaTestR(p, checks = FERMAS_TEST_DEFAULT_CHECKS) {
    const a = randomBigInt(FERMAS_TEST_MIN_RANDOM_NUMBER, p);   

    if(checks > 0) {
        return modExp(a, p - BIG_ONE, p) !== BIG_ONE ? false  : fermaTestR(p, --checks);
    }
    
    return true;
}

/**
 * The fermaTest() calculates the Fermat's primality test of a number. Loop version.
 * [a**(p-1) % p = 1 for all a < p.](https://en.wikipedia.org/wiki/Fermat_primality_test)
 * 
 * @param {bigint} p Estimated prime number.
 * @param {number} [checks = FERMAS_TEST_DEFAULT_CHECKS] Quantity of checks. The more checks, the more accurate the result, but the longer the calculation time.
 * @returns {boolean} True if the number is prime, false if the number is not prime.
 */
function fermaTest(p, checks = FERMAS_TEST_DEFAULT_CHECKS) {
    
    if(p < 2n) {
        return false;
    }

    for(let i = 0; i < checks; i++) {
        
        const a = randomBigInt(FERMAS_TEST_MIN_RANDOM_NUMBER, p);        
        if(modExp(a, p - 1n, p) !== 1n) {
            return false;
        }

    }
    return true;
}




/**
 * The gcdExBigInt() computes, in addition to the gcd, the coefficients **a** and **b** of the equation __a*x + b*y = gcd(x, y)__.
 * See [the Extended Euclidean algorithm](https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm) for more information.  
 * **BigInt only.**
 * 
 * @param {bigint} a First number.
 * @param {bigint} b Second number.
 * @returns {bigint[]} Array with the coefficients a and b of the equation a*x + b*y = gcd(x, y) and the gcd of a and b ([x, y, gcd(a, b)]).
 */
function gcdExBigInt(a, b) {
    if (b === BIG_ZERO) {
        return [BIG_ONE, BIG_ZERO, a];
    }
    const [q, r] = [a / b, a % b];
    const [s, t, g] = gcdExBigInt(b, r);
    return [t, s - q * t, g];    
}




//console.log(test(48, 23));



//console.log('r', fermaTestR(21377n, 2));
//console.log('d', fermaTest(21377n, 2));
//console.log('e', eulerst(21377));





export { 
    random, 
    fastPow, 
    modExp, 
    modExpR, 
    gcd, 
    eulerst, 
    randomBigInt, 
    fermaTestR, 
    fermaTest,
    gcdExBigInt
};