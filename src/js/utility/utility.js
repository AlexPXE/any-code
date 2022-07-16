

'use strict';

/**
 * Different utility functions and classes etc...
 * @module utility
 */


const TYPE_HANDLERS = [
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

 const {isVoid} = new function() {
    const voidValues = new Set([undefined, null, NaN, Infinity, -Infinity]);

    this.isVoid = (value) => {
        return voidValues.has(value);
    }
};

const customJSON = new function() {
    

    function ValueWrapp(sType, value) { /*Wrapper for the value being encoded*/
        this.JSONdecodeType = sType;
        this.JSONdecodeValue = value;
    }
    
    function ValueConverter(arr) { 
        
        const handlers = arr.reduce((acc, [name, e, d]) => acc.set(name, {e, d}), new Map());

        this.convert = value => {
            const type = value?.constructor?.name;
            
            if( handlers.has(type) ) {                
                return new ValueWrapp(type, handlers.get(type).e(value));
            }

            return  value;
        }        

        this.toOriginal = value => {
            if(value?.JSONdecodeType) {
                return handlers.get(value.JSONdecodeType).d(value.JSONdecodeValue);
            }

            return value;
        }
    }
   
    let {convert, toOriginal} = new ValueConverter(TYPE_HANDLERS); /*Processed types (class construtors names) and handlers*/

    /**
     * Encode method.
     */
    this.encode = (function() {        
    
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
     * Decode method.
     */
    this.decode = (function() {
        
        const cbFactory = reviewer => {

            if( isVoid(reviewer) ) {
                return function(key, value) {
                    return toOriginal(value);
                };
            }

            if( typeof reviewer === 'function' ) {
                return function(key, value) {
                    return reviewer(key, toOriginal(value) );
                }
            }
        };

        return (value, reviewer) => {        
            return JSON.parse(value, cbFactory(reviewer));
        }
    })();    
    
};


export {customJSON, isVoid};

