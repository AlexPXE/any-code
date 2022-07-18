

'use strict';

/**
 * Different utility functions and classes etc...
 * @module utility
 */



/**
 * Array of type handlers.
 * @typedef {array} TypeHandler
 * @property {string} 0 - Type name. For example for Date:
 *  ```JavaScript
 *      const d = new Date();
 *      d.constructor.name; // "Date"
 *  ```
 * @property {function} 1 - Encode function. For example for Date:
 * ```JavaScript
 *     value => value.getMilliseconds();
 * ```
 * @property {function} 2 - Decode function. For example for Date:
 * ```JavaScript
 *    value => new Date(value);
 * ``` 
 */



/**
 * Array of default type handlers.
 * @constant {Array<TypeHandler>}
 */
const DEFAULT_TYPE_HANDLERS = [
    [
        'Map', 
        value => [...value], 
        value => new Map(value)
    ],

    [
        'Set',
        value => [...value],
        value => new Set(value)
    ],

    [
        'BigInt',
        value => value.toString(),
        value => BigInt(value)
    ]
];

/**
 * function isVoid()  Check if value is `undefined` or `null` or `NaN` or `Infinity` or `-Infinity`. If so, return `true`.
 * @function isVoid
 * @param {any} value  Value to check.
 * @returns {boolean} `true` if value is `undefined`, `null`, `NaN`, `Infinity` or `-Infinity`.
 * @static
 */
 const {isVoid} = new function() {
    const voidValues = new Set([undefined, null, NaN, Infinity, -Infinity]);

    this.isVoid = value => {
        return voidValues.has(value);
    }
};


/**
 * @class 
 * This singleton class uses the JSON.stringify and JSON.parse functions and adds 
 * the ability to parse non-standard types by converting them to an object of the form `{ JSONdecodeType: 'string', JSONdecodeValue: any }`. 
 * 
 * @prop {CustomJSON} instance - Getter for the singleton instance.
 * @param {Array<TypeHandler>} [typeHandlers = DEFAULT_TYPE_HANDLERS] Array with type handlers functions and type names {@link module:utility~TypeHandler TypeHandler}
 * @returns {CustomJSON} Instance of the class.
 */
function CustomJSON(typeHandlers = DEFAULT_TYPE_HANDLERS) {   
    

    if(this.constructor.instance) {
        return this.constructor.instance;
    }

    
    const instance = this;

    Object.defineProperty(this.constructor, 'instance', {                     
        get() {
            return instance;
        }
    });

    /**
     * @class
     * classdesc ValueWrapp class is used to wrap values in the CustomJSON class. 
     * @param {string} sType Name of the type.
     * @param {any} value Converted value
     * @returns {ValueWrapp} ValueWrapp instance.
     * @inner
     */
    function ValueWrapp(sType, value) { /*Wrapper for the value being encoded*/ 
        /**
         * Type of the value.
         * @type {string}
         */  
        this.JSONdecodeType = sType;
        /**
         * Value.
         * @type {any}
         */
        this.JSONdecodeValue = value;
    }
     
    /**
     * Contains type names and handlers for them. Key is the type name and value is an object with two functions: {e: encode function, d: decode function}.
     * @type {Map<string, {e: function, d: function}>}
     */
    const handlers = new Map();    

    /**
     * The Convert() method checks if the `value?.constructor?.name` is in the {@link handlers handlers} if so, 
     * it uses the handler from the {@link handlers handlers} to convert the value.     * 
     * 
     * @param {any} value 
     * @returns {(ValueWrapp | any)}    
     */
    const convert = value => {
        const type = value?.constructor?.name;
            
        if( handlers.has(type) ) {                
            return new ValueWrapp(type, handlers.get(type).e(value));
        }

        return  value;
    }        

    /**
     * The Decode() method checks if the value is an object of the form `{JSONdecodeType: , JSONdecodeValue: }` if so, 
     * it converts the value of the "JSONdecodeValue" field into an object of the type whose name is written in the "JSONdecodeType" field. 
     * 
     * @param {any} value 
     * @returns {any}
     */
    const toOriginal = value => {       
        if(value?.JSONdecodeType) {            
            return handlers.get(value.JSONdecodeType).d(value.JSONdecodeValue);
        }

        return value;
    };

    /**
     * In fact, the `encode()` method itself is a wrapper for {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify JSON.stringify()}.  
     * 
     * @function 
     * @param {any} value The value to convert to a JSON string.
     * @param {function} [replacer] A function that alters the behavior of the stringification process, 
      or an array of strings or numbers naming properties of value that should be included in the output. 
      If replacer is null or not provided, all properties of the object are included in the resulting JSON string.
     * @param {number} [space] 
     * @returns {any}
     */
    this.encode = (function() /**function*/ {        
    
        const cbFactory = replacer => {     /*JSON.stringify callback factory*/
    
            if( isVoid(replacer) ) {        /*If there is no replacer*/
                return function(key, value) {
                    return convert(value);
                };
            }
    
            if( typeof replacer === 'function' ) {
                return function(key, value) {
                    return convert( replacer(key, value) );
                };
            }
    
            if(replacer?.[Symbol.iterator]) {    /*If replacer is an iterable*/
                const inclProps = new Set(replacer)
                    .add("")
                    .add("JSONdecodeType")
                    .add("JSONdecodeValue");
    
                return function(key, value) {
                    
                    if( inclProps.has(key) || Array.isArray(this) ) {
                        return convert(value);
                    } 
    
                    return undefined;
                }
            }        
        }
        
        return (value, replacer, space) => {        
            return JSON.stringify(value, cbFactory(replacer), space);
        }

    })();

    /**
     * In fact, the `decode()` method itself is a wrapper for {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse JSON.parse()}.
     * @function   
     * @param {string} text The string to parse as . See the JSON object for a description of [JSON syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON).
     * @param {function} [reviver] If a function, this prescribes how the value originally produced by parsing is transformed, before being returned.
     * @returns {any} The Object, Array, string, number, boolean, or null value corresponding to the given JSON text.
     */
    this.decode = (function() {
        
        const cbFactory = reviver => {

            if( isVoid(reviver) ) {                
                return function(key, value) {                    
                    return toOriginal(value);
                };
            }

            if( typeof reviver === 'function' ) {
                return function(key, value) {
                    return reviver(key, toOriginal(value) );
                }
            }
        };

        /**
        * In fact, the `decode()` method itself is a wrapper for {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse JSON.parse()}.
        * 
        * @param {string} text The string to parse as . See the JSON object for a description of [JSON syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON).
        * @param {function} [reviver] If a function, this prescribes how the value originally produced by parsing is transformed, before being returned.
        * @returns {any} The Object, Array, string, number, boolean, or null value corresponding to the given JSON text.
        * @private
        */
        return (text, reviver) => {
            if(typeof text !== 'string') {
                throw new Error('The text must be a string');
            }          

            return JSON.parse(text, cbFactory(reviver));
        }
    })();    
    
    /**
     * The `addHandlers()` method adds type handlers to the {@link handlers handlers} map.
     * If the type handler is already in the map, it is overwritten.
     * 
     * @param {Array<TypeHandler>} arr Array of type [handlers]{@link module:utility~TypeHandler}.
     * @returns {CustomJSON} This instance of the class.
     */
    this.addHandlers = arr => {
        arr.reduce((acc, [name, e, d]) => acc.set(name, {e, d}), handlers);        
        return this;
    };

    /**
     * The `removeAll()` method Removes all handlers.
     * 
     * @returns {customJSON} This instance of the class.
     */
    this.removeAll = () => {
        handlers.clear();
        return this;
    };

    /**
     * The `removeByName()` method removes the handler with the given name.
     * If there is no handler with the given name, the method does nothing.
     * 
     * @param  {...string} typeName 
     * @returns {customJSON} This instance of the class.
     */
    this.removeByName = (...typeName) => { 
        typeName.forEach(name => handlers.delete(name))
        return this;
    };

    /**
     * The `newHandlers()` removes all handlers and adds the given handlers.
     * 
     * @param {Array<TypeHandler>} arr Array of type [handlers]{@link module:utility~TypeHandler}.
     * @returns {CustomJSON} This instance of the class. 
     */
    this.newHandlers = arr => { /*remove all and add new handlers */
        handlers.clear();
        this.addHandlers(arr);

        return this;
    };

    /**
     * The `newHandlers()` replaces handlers for the given type name. 
     * If there is no handler with the given name, the method does nothing.
     * 
     * @param {Object} replacement
     * @param {string} replacement.n Type name.
     * @param {function} replacement.e Encoder function.
     * @param {function} replacement.d Decoder function.
     * @returns {CustomJSON} This instance of the class.
     */
    this.replaceHandler = ({n, e, d}) => {
        
        const h = handlers.get(n);

        if(h) {
            (typeof e === 'function') && (h.e = e);
            (typeof d === 'function') && (h.d = d);
        }

        return this;        
    };

    /**
     * The `getTypeNames()` method returns an array of type names.
     * 
     * @returns {Array<string>} Array of type names.
     */
    this.getTypeNames = () => [...handlers.keys()];

    /**
     * The `getHandler()` method checks if there is a handler for the given type name.
     * 
     * @param {string} typeStr Name of the type.
     * @returns {boolean} `true` if there is a handler for the given type name.
     */
    this.hasType = typeStr => handlers.has(typeStr);  
    
    /**
     * The hasValueType() method checks if a type handler exists for a given value.
     * 
     * @param {any} value  Value to check.
     * @returns {boolean} `true` if there is a type handler for the given value.
     */
    this.hasValueType = value => handlers.has(value?.constructor?.name);

    
    this.addHandlers(typeHandlers);   
}


/**
 * CustomJSON instance.
 * @type {CustomJSON}
 * @static
 */
const customJSON = new CustomJSON();


export {
    customJSON,
    isVoid,
}


