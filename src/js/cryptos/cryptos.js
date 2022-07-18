"use strict";

import {     
    gcdExBig,    
    modExpBig,         
    randomPrimeBig
} from '../math/math.js';

import { ObjectBigUint64 } from '../datastructures/arrayslike.js';


/**
 * The cryptos module provides tools for encryption and decryption.
 * @module cryptos
 */

//???: CONST
/** 
 * Defaults bitsize for RSA prime numbers.
 * @constant
 * @type {number}
 * @default
*/
const PRIME_NUMBERS_MIN_BIT_SIZE = 64;

/** 
 * Defaults bitsize for RSA public exponent.
 * @constant 
 * @type {number}
 * @default
*/
const OPEN_EXPONENT_BIT_SIZE = 16;

const alphabet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
    'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 
    'щ', 'ь', 'ы', 'ъ', 'э', 'ю', 'я','А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 
    'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ь', 'Ы', 'Ъ', 'Э', 'Ю', 'Я','=', '+', '-', '*', '/', '%', '^', '&', '|', '!', '?', '<', '>', '.', 
    ',', ':', ';', '"', '\'', '\\', '{', '}', '[', ']', '(', ')', ' ', '\n', '\t', '\r', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];


class RSAKeys {
        
    #description;
    #module;
    #publicExp;
    #privateExp;    
    #size;      
    
    /**
     * RSAKeys class constructor. Keys generetion is based on the [RSA algorithm](https://en.wikipedia.org/wiki/RSA_(cryptosystem))
     * This is a simple implementation of the RSA algorithm and it is intended for demonstration purposes only and is not intended for serious use.  
     * 
     * @param {number} [size = PRIME_NUMBERS_MIN_BIT_SIZE] bit size of prime numbers. 
     */
    constructor(size = PRIME_NUMBERS_MIN_BIT_SIZE, description = '') {
        
        if(size < PRIME_NUMBERS_MIN_BIT_SIZE) {
            this.#size = PRIME_NUMBERS_MIN_BIT_SIZE;
        } else {
            this.#size = size;
        }        
        this.#description = description;

        this.#generate();
    }

    /**
     * Private *`#getKey()`* method creates a new object from the *`RSAKeys`* instance properties passed to it.
     * @function module:cryptos~RSAKeys~getKey
     * @param  {...string} props Properties to get.
     * @returns {object} Object with the properties passed to the method.     
     */
    #getKey(...props) {
        const key = Object.create(null);

        return Object.freeze( 

            props.reduce((obj, prop) => {
                obj[prop] = this[prop];
                return obj;
            }, key)
        );
    }

    /**
     * Private *`#generate()`*  method generates keys based on the [RSA algorithm.](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) 
     * @function module:cryptos~RSAKeys~generate
     * 
     */
     #generate() {
        const primePair = new Set();

        while(primePair.size < 2) {
            primePair.add( randomPrimeBig(this.#size) );        
        }
                    //Prime numbers
        const [p1, p2] = primePair.values();        
        const phi = (p1 - 1n) * (p2 - 1n);  //Euler's totient function https://en.wikipedia.org/wiki/Euler%27s_totient_function
        const phiSize = phi.toString(2).length; //Size of the phi in bits 
        
        let e;

         do {       //Bit size of the open exponent should be less than the bit size of the phi.            
            e = randomPrimeBig(phiSize > OPEN_EXPONENT_BIT_SIZE ? 
                OPEN_EXPONENT_BIT_SIZE : 
                phiSize - 1
            );
        } while (phi % e === 0n)           
                    //Find the private exponent using the extended Euclidean algorithm https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
        const tmp = gcdExBig(e, phi)[0];               
        
            
        this.#module = p1 * p2;            
        this.#publicExp = e;
        this.#privateExp = tmp < 0n ? tmp + phi : tmp; //if private exponent is negative, add phi to it
    }

    /**
     * *Getter* for the bit size of prime numbers. *Type: `number`*.
     */
    get size() {
        return this.#size;
    }

    get description() {
        return this.#description;
    }

    get module() {
        return this.#module;
    }

    get publicExp() {
        return this.#publicExp;
    }

    get privateExp() {
        return this.#privateExp;
    }

    /**
     * *Getter* for public key. *Type: `object`*.
     * @type {{publicExp: bigint, module: bigint, description: string}}
     */
    get publicKey() {
        return this.#getKey('publicExp', 'module', `description`);
    }

    /**
     * *Getter* for private key. *Type: `object`*.
     * @type {{privateExp: bigint, module: bigint, description: string}}
     */
    get privateKey() {
        return this.#getKey('privateExp', 'module', `description`);
    }
}



//???: TextCrypto
class TextCrypto {
    #encoder = new TextEncoder();
    #decoder = new TextDecoder();    
    
    /**
     * ***TextCrypto class*** includes methods for encryption and decryption of text using the [RSA algorithm.](https://en.wikipedia.org/wiki/RSA_(cryptosystem))
     * It is intended for demonstration purposes only and is not intended for serious use.
     */
    constructor() {        
    }
    
    /**
     * TextCrypto.prototype.#encrypt() method encrypts the text using the public key.
     * 
     * @param {string} data String to encrypt.
     * @param {{module: bigint, publicExp: bigint, description: string}} keys Keys to use for encryption.
     * @returns {{description: string, encrypted: bigint[]}}  Frozen object with encrypted data and description.  
     *
     */
    encrypt(data, { module, publicExp, description }) {

        const result = Object.create(null);

        result.description = description;
        result.encrypted = new ObjectBigUint64(this.#encoder.encode(data).buffer)
            .map( value => modExpBig(value, publicExp, module) );

        return Object.freeze(result);
    }
    
    /**
     * TextCrypto.prototype.#decrypt() method decrypts the text using the private key.
     * 
     * @param {{encrypted: bigint[], description: string}} data Object with encrypted data and description.
     * @param {{privateExp: bigint, module: bigint}} keys Keys to use for decryption.
     * @returns {{description: string, decrypted: string}} Frozen object with decrypted data and description.
     */
    decrypt({ encrypted, description }, { privateExp, module }) {
        const result = Object.create(null);

        const decrypted = new ObjectBigUint64(encrypted.length);

        encrypted.forEach( (value, index) => {
            decrypted.setValue(index, modExpBig(value, privateExp, module));
        });

        result.description = description;        
        result.decrypted = this.#decoder.decode(new Uint8Array(decrypted
            .filterUint8(value => value !== 0)
        )); 

        return Object.freeze(result);
    }
}

export { RSAKeys, TextCrypto };







 




















