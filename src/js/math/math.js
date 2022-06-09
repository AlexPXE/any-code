
"use strict";

/**
 * The random(max, min) function returns a random integer between min and max (inclusive).
 * 
 * @param {Number} max  The upper limit of the range.
 * @param {Number} min The lower limit of the range.
 * @returns {Number} A random integer between min and max (inclusive).
 */
function random(min, max) {
    return Math.floor( Math.random() * (max - min + 1)) + min;
}


/**
 * Fast pow algorithm, works with both positive and negative exponents. 
 * Works with [BigInt only](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).
 * 
 * @param {BigInt} n Number thet will be raised to the power. BigInt only.
 * @param {BigInt} p Exponent. BigInt only. 
 * @returns {BigInt} Result.
 */ 
 function fastPow(n, p) {        

    if(typeof p !== 'bigint') {        
        throw new Error('Function fastPow() only accepts integer exponents.');
    }   
    
    let tmp = 1n;
    let x = n;
        // if p is negative, then make it positive and remember the sign 
    const sign = (p < 0n) && !!( p = (-p) );    

       //if pow equals 0 or 1, then skip the loop
    while(p > 1n) {
        
        if(p % 2n === 1n) {
            p--;
            tmp *= x;                                    
        }
        p = p / 2n;
        x = x * x;
    }

    tmp *= x;
        //if p == 0, then return 1, else if sign is true (negative exponent), then return 1/tmp.
        //else return tmp
    return p === 0n ? 1n : (sign ? 1n / tmp : tmp);
}

/**
 * The modExp() function is a cyclic function that calculates the modular exponentiation of a number. 
 * Works with [BigInt only](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).
 * 
 * @param {BigInt} a Number thet will be raised to the power. BigInt only.
 * @param {BigInt} p Exponent. BigInt only.
 * @param {BigInt} m Modulus. BigInt only.
 * @returns {BigInt} Result of modular exponentiation.
 */
const modExp = (a, p, m) => {
    
    let result = BigInt(1);    

    a = a % m;
    while (p > 0n) {
        if (p % 2n === 1n) {
            result = (result * a) % m;
            p--;
        }
        a = (a * a) % m;
        p = p / 2n;        
    }
    return result;    
};


/**
 * The modExpRecur() function is a recursive function that calculates the modular exponentiation of a number.
 * Works with [BigInt only](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).
 * 
 * @param {BigInt} a Number thet will be raised to the power. BigInt only.
 * @param {BigInt} p Exponent. BigInt only.
 * @param {BigInt} m Modulus. BigInt only.
 * @returns {BigInt} Result of modular exponentiation.
 */
const modExpRecur = (a, p, m) => {
    if(p === 0n) {
        return 1n;
    }

    a = a % m;
    if(p % 2n === 1n) {       
       return (a * modExpRecur(a * a, p-- / 2n, m)) % m;
    }

    return modExpRecur(a * a, p / 2n, m);
};


/**
 * The gcd() function calculates the greatest common divisor of two numbers.
 * 
 * @param {number} n First number.
 * @param {number} m Second number.
 * @returns {number} gcd of n and m.
 */
function gcd(n, m) {
    return m === 0 ? n : gcd(m, n % m);
}

/**
 * The eulert() function calculates the Euler's totient function of a number.
 * 
 * @param {number} n Number to calculate Euler's totient function.
 * @returns {number} Euler's totient function of n.
 */
function eulert(n) {
    let d = 0;
    for(let i = 1; i < n; i++) {
        if ( gcd(n, i) === 1) {
            console.log(` ${n},  ${i}`);
            d++;
        }
    }
    return d;
}

export { random, fastPow, modExp, modExpRecur, gcd, eulert };