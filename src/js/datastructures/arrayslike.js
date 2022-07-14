import {modulo} from '../math/math.js';

/**
 * @module arrayslike
 */

class ObjectBigUint64 {

    #buffer;    
    #dataView;
    #length;    
    #litleEndian = false;
     /**
     * ***`ObjectBigUint64`*** class is a wrapper for a ***`ArrayBuffer`*** that stores a 64-bit unsigned integers.
     * 
     * If ***`ArrayBuffer` `byteLength`*** is not a multiple of ***`8`***, the `ObjectBigUint64` constructor will automatically expand the size of ***`ArrayBuffer`*** to a multiple of `8`.
     * Missing bytes will be added to the beginning of ***`ArrayBuffer`*** with value 0
     *
     * If a number is passed instead of an ***`ArrayBuffer`***, the ***`ObjectBigUint64`*** constructor will automatically 
     * create an ***`ArrayBuffer`*** with the size of (`8` * passed number) bytes.
     * 
     * @param {(ArrayBuffer|number)} bufferLike ***`ArrayBuffer`*** or the number of elements representing the 64-bit unsigned integers.
     * @throws {TypeError} If the argument is not an ***`ArrayBuffer`*** or a number.
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
     * @returns {Iterator} iterator for the 64-bit unsigned integers.
     */
    *[Symbol.iterator]() {
        for(let i = 0; i < this.#length; i++) {
            yield this.getValue(i);
        }
    }    
    /**
     * Returns the 64-bit unsigned integer at the specified index.
     * @param {number} index Index of the 64-bit unsigned integer. The index must be between `0` and ***`this.length` - 1*** 
     * @returns {bigint} The 64-bit unsigned integer.
     * @throws {RangeError} If the index is out of range.
     */
    getValue(index) {
        if(index < 0 || index >= this.#length) {
            throw new RangeError('Index out of range.');
        }

        return this.#dataView.getBigUint64(index * 8, this.#litleEndian);
    }

    /**
     * Sets the 64-bit unsigned integer at the specified index.
     * @param {number} index Index of the 64-bit unsigned integer. The index must be between 0 and ***`this.length` - 1***. 
     * @param {bigint} value `bigint` value to set.
     * @throws {RangeError} If the index is out of range.
     */
    setValue(index, value) {
        if(index < 0 || index >= this.#length) {
            throw new RangeError('Index out of range.');
        }

        this.#dataView.setBigUint64(index * 8, value, this.#litleEndian);
    }

    /**
     * Returns the 8-bit unsigned integer at the specified index between `0` and ***`this.bytelength` - 1***.
     * @param {number} index Index of the 8-bit unsigned integer. The index must be between 0 and ***`this.bytelength` - 1***.
     * @returns {number} The 8-bit unsigned integer.
     * @throws {RangeError} If the index is out of range.
     */
    getUint8(index) {
        if(index < 0 || index >= this.byteLength) {
            throw new RangeError('Index out of range.');
        }

        return this.#dataView.getUint8(index);
    }

    /**
     * Sets the 8-bit unsigned integer at the specified index between `0` and ***`this.bytelength` - 1***.
     * @param {number} index Index of the 8-bit unsigned integer. The index must be between 0 and ***`this.bytelength` - 1***.
     * @param {number} value 0-255
     * @throws {RangeError} If the index is out of range.
     */
    setUint8(index, value) {
        if(index < 0 || index >= this.byteLength) {
            throw new RangeError('Index out of range.');
        }

        this.#dataView.setUint8(index, value);
    }

    /**
     * Getter for the byte length of the ***`ArrayBuffer`***.
     * @type {number}
     */
    get byteLength() {
        return this.#buffer.byteLength;
    }

    /**
     * ***Getter***. The number of 64-bit unsigned integers.
     * @type {number}
     */
    get length() {
        return this.#length;
    }

    /**
     * ***Getter***. The ***`ArrayBuffer`*** object.
     * @type {ArrayBuffer}
     */
    get buffer() {
        return this.#buffer;
    }    
    /**
     * ***Getter***. Returns the ***little endian flag*** (***`true`*** if little endian, ***`false`*** if big endian).
     * @type {boolean}
     */
    get littleEndian() {
        return this.#litleEndian;
    }
    /**
     * ***Setter***. Sets the ***little endian flag*** (***`true`*** for little endian, ***`false`*** for ***big endian***).
     * @param {boolean} value 
     */
    set litleEndian(value) {
        this.#litleEndian = !!value;
    }    
    /**
     * Calls a defined callback function on each BigUint64 element of an ***`ArrayBuffer`***, and returns an array that contains the results.
     * 
     * @param {mapUint64Callback} callback [`mapUint64Callback(value, index, context)`]{@link module:arrayslike~mapUint64Callback}
     * @returns {any[]} 
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
     * @param {filterUint8Callback} callback ***`filterUint8Callback(value, index, context)`***
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
    #propsCache = new Set();
/**
 * ***`ExtMap`*** is a subclass of `Map` that adds the following methods: ***stringify()***, ***parse()***.
 * Among other things, a getter and a setter are created for each added key. * 
 * @param {Array[]} [entries] ***entries:`[[key:(string | number), value: any], ...]`***
 * 
 */
    constructor(entries) {
        super();        
        
        entries && this.fromEntries(entries);        
    }

    /**
     * Checks if the given key is a property of the object.
     * 
     * @param {(number | string)} key Name of the property
     * @returns {boolean} ***`true`*** if the key is a property of object, ***`false`*** otherwise.
     */
    hasOwnProp(key) {
        return this.#propsCache.has(key);
    }

    /**
     * Works similarly to ***`Map.prototype.set()`*** but additionally creates a getter and setter for the key.
     * 
     * @param {(string|number)} key Key of the entry.
     * @param {*} [value = null] Value of the entry.
     * @returns {this}
     * @throws {TypeError} If the key is not a string or number.
     */    
    setProp(key, value = null) {        

        if(!this.hasOwnProp(key)) {

            if(typeof key === 'object') {
                throw new Error('Key can not be an object');
            }
            
            this.#propsCache.add(key);

            Object.defineProperties(this, {
                [key]: {
                    configurable: true,                    
                    set(value) {                        
                        this.set(key, value);
                    },
    
                    get() {
                        return this.get(key);
                    }
                }            
            });    
        }
        
        this[key] = value;

        return this;
    }

    /**
     * ***`stringify()`*** returns a ***JSON string*** representation of the ***`ExtMap`*** instance.
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
     * `parse()` parses a ***JSON string*** representation of an ***`ExtMap`*** object and returns this.
     * 
     * @param {string} str String representation of an ***`ExtMap`*** object.
     * @returns {this} Context of the ***parse()*** call.
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
     * Adds entries to the ***`ExtMap`*** object and creates getters and setters for the keys.
     * @param {Array[]} entries ***entries:`[[key:(string | number), value: any], ...]`***
     * @returns {this}
     */
    fromEntries(entries) {
        entries.forEach( ([key, value]) => this.setProp(key, value) );
        return this
    }
    
    /**
     * Returns a string representation of the ***`ExtMap`*** object.
     * 
     * @returns {string} String representation of the `ExtMap` object.
     * @tutorial ExtMapToString
     */
    toString() {
        return `${this.constructor.name}: ${this.stringify()}`;
    }    
    
    /**
     * ***`deleteProps()`*** works similarly to ***`Map.prototype.delete()`*** but additionally deletes the getter and setter for the key.
     * 
     * @param  {...(number | string)} keys 
     * @returns {this} Context of the `delete()` call.
     */
    deleteProps(...keys) {
        keys.forEach( key => {
            if( this.#propsCache.delete(key) ) {
                this.delete(key);
                delete this[key];
            }            
        });
        return this;
    }

    /**
     * ***`clearAllProps()`*** deletes all properties that were created by ***`setProp()`***.
     * 
     * @returns {this} Context of the `clear()` call.
     */
    clearAllProps() {
        this.deleteProps(...this.#propsCache);
        return this;
    }

    /**
     * ***fromOwnFields()*** creates a ***`MapMod`*** object from the own fields of the object.
     * 
     * @param  {...(number | string)} fields Fields of the object.
     * @returns {ExtMapMod}
     * @tutorial ExtMapFromOwnFields
     */
     fromOwnFields(...fields) {// TODO: Check if method works correctly

        const inst = new this.constructor();

        fields.forEach( field => {

            if(this.has(field)) {
                inst.setProp(field, this[field]);
            }
        } );
        
        return inst;
    }

    /**
     * Returns an array of entries ***(`[key, value]`)*** satisfying the condition specified in a callback function.
     * 
     * @param {filterCallback} callback 
     * @returns {Array[]} ***entries:`[[key:(string | number), value: any], ...]`*** satisfying the condition specified in a callback function.
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

    #propsCache = new Set();

    /**
     * Extends the `ExtMap` class and ddds new features for some methods and adds `fromOwnFields()` method.
     * @param {Array[]} [entries] ***entries:`[[key:(string | number), value: any], ...]`***
     */
    constructor(entries) {
        super(entries);
    }
    /**
     * Works similarly to ***`Map.prototype.set()`*** but additionally creates a getter and setter for the key.
     * Setter will check the type of the passed value. The type checking logic in the setter is based on the `topeof` operator.
     * 
     * @param {(string | number)} key key of the entry.
     * @param {*} value Value of the entry. 
     * @param {string} [type] Type of the value. Default: `typeof value`. The type is set when the value is first set.
     * @returns {this} Context of the ***`setProp()`*** call.
     * @throws {TypeError} If the type of the value is not the same as the type of the passed `type`.
     * @throws {TypeError} If the key is not a string or number.
     * @tutorial ExtMapModSetProp
     */
    setProp(key, value, type = typeof value) {
        if(!this.hasOwnProp(key)) {

            if(typeof key === 'object') {
                throw new TypeError('Key can not be an object.');
            }

            this.#propsCache.add(key);

            Object.defineProperties(this, {
                [key]:{
                    
                    set(value) {
                        if(typeof value !== type) { //TODO: implement type checking differently
                            throw new TypeError('Value must be a ' + type);
                        }

                        this.set(key, value);
                    },
    
                    get() {
                        return this.get(key);
                    }
                }            
            });    
        }

        this[key] = value;

        return this;
    }
}



/**
 * Callback function for [`ObjectBigUint64.prototype.map(callback)` method]{@link module:arrayslike~ObjectBigUint64#map} 
 * 
 * @callback mapUint64Callback
 * @param {bigint} value Uint64 value.
 * @param {number} index Index of value in array.
 * @param {ObjectBigUint64} context  
 * @returns {any} value of the callback. * 
 */

/**
 * Callback function for [`ObjectBigUint64.prototype.filterUint8(callback)` method]{@link module:arrayslike~ObjectBigUint64#filterUint8}
 * 
 * @callback filterUint8Callback
 * @param {number} value Unsigned 8-bit integer
 * @param {number} index Index of the element in the array
 * @param {ObjectBigUint64} context  
 * @returns {boolean}
 */


/**
 * Callback function for [`ExtMap.prototype.filter(callback)` method]{@link module:arrayslike~ExtMap#filter}
 * @callback filterCallback
 * @param {(number | string)} key Key of the entry.
 * @param {any} value Value of the entry.
 * @param {ExtMap} context Context of the filter method call.
 * 
 */


export { ExtMap, ExtMapMod, ObjectBigUint64 };