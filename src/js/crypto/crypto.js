"use strict";
//TODO: Add a description of the module

import {     
    gcdExBig,    
    modExpBig,     
    modulo,    
    randomPrimeBig
} from '../math/math.js';

/**
 * The crypto module provides tools for encryption and decryption.
 * @module crypto
 */

//???: CONST
const PRIME_NUMBERS_MIN_BIT_SIZE = 64;
const OPEN_EXPONENT_BIT_SIZE = 16;

const alphabet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
    'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 
    'щ', 'ь', 'ы', 'ъ', 'э', 'ю', 'я','А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 
    'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ь', 'Ы', 'Ъ', 'Э', 'Ю', 'Я','=', '+', '-', '*', '/', '%', '^', '&', '|', '!', '?', '<', '>', '.', 
    ',', ':', ';', '"', '\'', '\\', '{', '}', '[', ']', '(', ')', ' ', '\n', '\t', '\r', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];


//???: ObjectBigUint64

class ObjectBigUint64 {

    #buffer;    
    #dataView;
    #length;    
    #litleEndian = false;
     /**
     * `ObjectBigUint64` class is a wrapper for a `ArrayBuffer` that stores a 64-bit unsigned integers.
     * 
     * If `ArrayBuffer` `byteLength` is not a multiple of `8`, the `ObjectBigUint64` constructor will automatically expand the size of `ArrayBuffer` to a multiple of `8`.
     * Missing bytes will be added to the beginning of `ArrayBuffer` with value 0
     *
     * If a number is passed instead of an `ArrayBuffer`, the `ObjectBigUint64` constructor will automatically 
     * create an `ArrayBuffer` with the size of (`8` * passed number) bytes.
     * 
     * @param {(ArrayBuffer|number)} bufferLike `ArrayBuffer` or the number of elements representing the 64-bit unsigned integers.
     * @throws {TypeError} if the argument is not an `ArrayBuffer` or a number.
     */
    
    constructor(bufferLike) {
        
        try {
            
            if(bufferLike instanceof ArrayBuffer) {
                const { byteLength } = bufferLike;

                this.#buffer = new Uint8Array([
                ...new Uint8Array( modulo(-byteLength, 8) ),
                ...new Uint8Array(bufferLike)
            ]).buffer;
               
            } else {                
                this.#buffer = new ArrayBuffer(bufferLike * 8);
            }            
            
        } catch(e) {
            throw new TypeError('Invalid argument.');
        }
                
        this.#dataView = new DataView(this.#buffer);
        this.#length = this.#buffer.byteLength / 8;
    }

    /**
     * Iterator for the 64-bit unsigned integers.
     */
    *[Symbol.iterator]() {
        for(let i = 0; i < this.#length; i++) {
            yield this.getValue(i);
        }
    }    
    /**
     * Returns the 64-bit unsigned integer at the specified index.
     * @param {number} index index of the 64-bit unsigned integer. The index must be between 0 and `this.length` - 1. 
     * @returns {bigint} the 64-bit unsigned integer.
     * @throws {RangeError} if the index is out of range.
     */
    getValue(index) {
        if(index < 0 || index >= this.#length) {
            throw new RangeError('Index out of range.');
        }

        return this.#dataView.getBigUint64(index * 8, this.#litleEndian);
    }
    /**
     * Sets the 64-bit unsigned integer at the specified index.
     * @param {number} index index of the 64-bit unsigned integer. The index must be between 0 and `this.length` - 1. 
     * @param {bigint} value bigint value to set.
     * @throws {RangeError} if the index is out of range.
     */
    setValue(index, value) {
        if(index < 0 || index >= this.#length) {
            throw new RangeError('Index out of range.');
        }

        this.#dataView.setBigUint64(index * 8, value, this.#litleEndian);
    }
    /**
     * Returns the 8-bit unsigned integer at the specified index between 0 and `this.bytelength` - 1.
     * @param {number} index index of the 8-bit unsigned integer. The index must be between 0 and `this.bytelength` - 1.
     * @returns {number} the 8-bit unsigned integer.
     * @throws {RangeError} if the index is out of range.
     */
    getUint8(index) {
        if(index < 0 || index >= this.byteLength) {
            throw new RangeError('Index out of range.');
        }

        return this.#dataView.getUint8(index);
    }
    /**
     * Sets the 8-bit unsigned integer at the specified index between 0 and `this.bytelength` - 1.
     * @param {number} index index of the 8-bit unsigned integer. The index must be between 0 and `this.bytelength` - 1.
     * @param {number} value 0-255
     * @throws {RangeError} if the index is out of range.
     */
    setUint8(index, value) {
        if(index < 0 || index >= this.byteLength) {
            throw new RangeError('Index out of range.');
        }

        this.#dataView.setUint8(index, value);
    }
    /**
     * Getter for the byte length of the `ArrayBuffer`.
     * @type {number}
     */
    get byteLength() {
        return this.#buffer.byteLength;
    }

    /**
     * Getter. The number of 64-bit unsigned integers.
     * @type {number}
     */
    get length() {
        return this.#length;
    }

    /**
     *Getter. The `ArrayBuffer` object.
     * @type {ArrayBuffer}
     */
    get buffer() {
        return this.#buffer;
    }    
    /**
     * Getter. Returns the little endian flag (`true` if little endian, `false` if big endian).
     * @type {boolean}
     */
    get littleEndian() {
        return this.#litleEndian;
    }
    /**
     * Setter. Sets the little endian flag (`true` for little endian, `false` for big endian).
     * @param {boolean} value 
     */
    set litleEndian(value) {
        this.#litleEndian = !!value;
    }    
    /**
     * Calls a defined callback function on each BigUint64 element of an `ArrayBuffer`, and returns an array that contains the results.
     * 
     * @param {mapUint64Callback} callback `mapUint64Callback(value, index, context)`
     * @returns {*[]} 
     */
    map(callback) {
        const resultArray = [];

        for(let i = 0; i < this.length; i++) {
            resultArray.push(callback(this.getValue(i), i, this));
        }

        return resultArray;
    }
    
    /**
     * Returns the uint8 elements of an array that meet the condition specified in a callback function.
     * 
     * @param {filterUint8Callback} callback `filterUint8Callback(value, index, context)`
     * @returns {number[]}
     */
    filterUint8(callback) {
        const resultArray = [];
        const {byteLength} = this;

        for(let i = 0; i < byteLength; i++) {

            if( callback(this.getUint8(i), i, this) ) {
                resultArray.push(this.getUint8(i));
            }
        }

        return resultArray;
    }
}

class ExtMap extends Map {
/**
 * `ExtMap` is a subclass of `Map` that adds the following methods: stringify(), parse().
 * Among other things, a getter and a setter are created for each added key. * 
 * @param {Array[]} [entries] entries:`[[key:(string | number), value: any], ...]`
 * 
 */
    constructor(entries) {
        super();        
        
        entries && this.fromEntries(entries);        
    }

    /**
     * Works similarly to `Map.prototype.set()` but additionally creates a getter and setter for the key.
     * 
     * @param {(string|number)} key key of the entry.
     * @param {*} [value = null] value of the entry.
     * @returns {this}
     * @throws {TypeError} if the key is not a string or number.
     */
    set(key, value = null) {        

        if(!this.has(key)) {

            if(typeof key === 'object') {
                throw new Error('Key can not be an object');
            }    

            Object.defineProperties(this, {
                [key]: {
                    
                    set(value) {                        
                        this.setData(key, value);
                    },
    
                    get() {
                        return this.getData(key);
                    }
                }            
            });    
        }
        
        this[key] = value;

        return this;
    }

    /**
     * `stringify()` returns a JSON string representation of the `ExtMap` instance.
     * 
     * @returns {string}
     * @tutorial ExtMapStringifyParse
     */
    stringify() {
        return JSON.stringify( Object.fromEntries(this.entries()),
        (k, v) => {
            if(typeof v === 'bigint') {
                return v.toString() + 'TBigint'; //
            }
            return v;
        }, 2 );
    }

    /**
     * `parse()` parses a JSON string representation of an `ExtMap` object and returns this.
     * 
     * @param {string} str 
     * @returns {this}
     * @tutorial ExtMapStringifyParse
     */
    parse(str) {
        const tmp = JSON.parse(str, (k, v) => {

            if((typeof v === 'string') && v.endsWith('TBigint')) {                
                return BigInt(v.slice(0, -7));
            }

            return v;
        });

        const type = tmp.constructor;

        try{
            if(type === Object) {
                this.fromEntries(Object.entries(tmp));
    
            } else if(type === Array) {
                this.fromEntries(tmp);

            } else {
                throw new TypeError(`Can not parse string: ${tmp}`);        
            }
        } catch(e) {
            throw new TypeError(e.message);
        }

        return this;
    }
    
    /**
     * Adds entries to the `ExtMap` object and creates getters and setters for the keys.
     * @param {Array[]} entries entries:`[[key:(string | number), value: any], ...]`
     * @returns {this}
     */
    fromEntries(entries) {
        entries.forEach( ([key, value]) => this.set(key, value) );
        return this
    }
    
    /**
     * Returns a string representation of the `ExtMap` object.
     * 
     * @returns {string} String representation of the `ExtMap` object.
     * @tutorial ExtMapToString
     */
    toString() {
        return 'Extended Map: ' + this.stringify();
    }
    /**
     * Adds entries to the `ExtMap` but does not create getters and setters for the keys.
     * 
     * @param {*} key 
     * @param {*} value 
     * @returns 
     */
    setData(key, value) {
        super.set(key, value);
        return this;
    }
    /**
     * Works similarly to `Map.prototype.get()`.
     * 
     * @param {*} key key of the entry.
     * @returns {*} value of the entry.
     */
    getData(key) {
        return super.get(key);
    }
    /**
     * `delete()` works similarly to `Map.prototype.delete()` but additionally deletes the getter and setter for the key.
     * 
     * @param  {...(number | string)} keys 
     * @returns {this} context of the `delete()` call.
     */
    delete(...keys) {
        keys.forEach( keys => {
            super.delete(keys) ? delete this[keys] : null;
        } );
        return this;
    }
    /**
     * `clear()` works similarly to `Map.prototype.clear()` but additionally deletes the getters and setters for the keys.
     * @returns {this} context of the `clear()` call.
     */
    clear() {
        super.clear();
        Object.keys(this).forEach( key => delete this[key] );
        return this;
    }
    /**
     * Returns an array of entries (`[key, value]`) satisfying the condition specified in a callback function.
     * 
     * @param {filterCallback} callback 
     * @returns {Array[]} entries:`[[key:(string | number), value: any], ...]` satisfying the condition specified in a callback function.
     */
    filter(callback) {
        const resultArray = [];

        for(let [key, value] of this) {
            if(callback(value, key, this)) {
                resultArray.push([key, value]);
            }
        }

        return resultArray;
    }
}

class ExtMapMod extends ExtMap {   
    /**
     * Extends the `ExtMap` class and ddds new features for some methods and adds `fromOwnFields()` method.
     * @param {Array[]} [entries] entries:`[[key:(string | number), value: any], ...]`
     */
    constructor(entries) {
        super(entries);
    }
    /**
     * Works similarly to `Map.prototype.set()` but additionally creates a getter and setter for the key.
     * Setter will check the type of the passed value. The type checking logic in the setter is based on the `topeof` operator.
     * 
     * @param {(string | number)} key key of the entry.
     * @param {*} value value of the entry. 
     * @param {string} [type] type of the value. Default: `typeof value`. The type is set when the value is first set.
     * @returns {this} context of the `set()` call.
     * @throws {TypeError} if the type of the value is not the same as the type of the passed `type`.
     * @tutorial ExtMapModSet
     */
    set(key, value, type = typeof value) {
        if(!this.has(key)) {

            if(typeof key === 'object') {
                throw new TypeError('Key can not be an object.');
            }

            Object.defineProperties(this, {
                [key]:{
                    
                    set(value) {
                        if(typeof value !== type) { //TODO: implement type checking differently
                            throw new Error('Value must be a ' + type);
                        }

                        this.setData(key, value);
                    },
    
                    get() {
                        return this.getData(key);
                    }
                }            
            });    
        }

        this[key] = value;

        return this;
    }
    
    /**
     * fromOwnFields() creates a `ExtMapMod` object from the own fields of the object.
     * 
     * @param  {...(number | string)} fields fields of the object.
     * @returns {ExtMapMod}
     */
    fromOwnFields(...fields) {
        return new ExtMapMod( fields.map( field => [field, this[field]] ));
    }
}

//???:keyGen
class KeysGeneratorInterface {
    constructor() {
        if(this.constructor === KeysGeneratorInterface) {
            throw new Error(`Cannot construct KeysGeneratorInterface instances directly!`);
        }        
    }

    get size() {
        throw new Error(`Not implemented!`);
    }

    set size(size) {
        throw new Error(`Not implemented!`);
    }

    generate() {
        throw new Error(`Not implemented!`);
    }
}

class KeysGenerator extends KeysGeneratorInterface {
    
    #size;
    constructor(size = PRIME_NUMBERS_MIN_BIT_SIZE) {
        super();

        this.size = size;
    }   

    get size() {
        return this.#size;
    }
    
    set size(size) {
        if(size < PRIME_NUMBERS_MIN_BIT_SIZE) {
            this.#size = PRIME_NUMBERS_MIN_BIT_SIZE;
        } else {
            this.#size = size;
        }        
        
    }

    generate(description = '') {
        const primePair = new Set();
        while(primePair.size < 2) {
            primePair.add( randomPrimeBig(this.#size) );        
        }
        
        const [p1, p2] = primePair.values();        
        const phi = (p1 - 1n) * (p2 - 1n); 
        const phiSize = phi.toString(2).length;
        
        let e;

         do {
            e = randomPrimeBig(phiSize > OPEN_EXPONENT_BIT_SIZE ? 
                OPEN_EXPONENT_BIT_SIZE : 
                phiSize - 1
            );
        } while (phi % e === 0n)           

        const tmp = gcdExBig(e, phi)[0];               
        
        const keys = new ExtMapMod([
            ['description', description],
            ['module', p1 * p2],            
            ['publicExp', e],
            ['privateExp', tmp < 0n ? tmp + phi : tmp],

        ]);
                
        return keys;
    }
}

//???: TextCrypto
class TextCrypto {
    #encoder = new TextEncoder();
    #decoder = new TextDecoder();    

    encrypt(data, keys) {
        const { module, publicExp, description} = keys;               

        return new ExtMapMod([
            ['description', description],
            ['encrypted', 
                new ObjectBigUint64(this.#encoder.encode(data).buffer)
                .map( value => modExpBig(value, publicExp, module) )
            ]            
        ]);
    }
    
    decrypt(data, keys) {
        const { encrypted, description } = data;
        const { privateExp, module } = keys;

        const decrypted = new ObjectBigUint64(encrypted.length);

        encrypted.forEach( (value, index) => {
            decrypted.setValue(index, modExpBig(value, privateExp, module));
        });

        return new ExtMapMod([
            ['description', description],
            ['decrypted', this.#decoder.decode(new Uint8Array(decrypted
                .filterUint8(value => value !== 0)
            ))]
        ]);
    }
}

/**
 * Callback function for [`ObjectBigUint64.prototype.map(callback)` method]{@link module:crypto~ObjectBigUint64#map}
 * 
 * @callback mapUint64Callback
 * @param {bigint} value Uint64 value.
 * @param {number} index Index of value in array.
 * @param {ObjectBigUint64} context  
 * @returns {*} value of the callback.
 */

 

/**
 * Callback function for [`ObjectBigUint64.prototype.filterUint8(callback)` method]{@link module:crypto~ObjectBigUint64#filterUint8}
 * 
 * @callback filterUint8Callback
 * @param {number} value Unsigned 8-bit integer
 * @param {number} index Index of the element in the array
 * @param {ObjectBigUint64} context  
 * @returns {boolean}
 */

/**
 * Callback function for [`ExtMap.prototype.filter(callback)` method]{@link module:crypto~ExtMap#filter}
 * @callback filterCallback
 * @param {(number | string)} key Key of the entry.
 * @param {*} value Value of the entry.
 * @param {this} context Context of the filter method call.
 * 
 */




 




















