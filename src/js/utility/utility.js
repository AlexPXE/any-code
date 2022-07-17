

'use strict';

/**
 * Different utility functions and classes etc...
 * @module utility
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

 const {isVoid} = new function() {
    const voidValues = new Set([undefined, null, NaN, Infinity, -Infinity]);

    this.isVoid = (value) => {
        return voidValues.has(value);
    }
};

const customJSON = new function(typeHandlers = DEFAULT_TYPE_HANDLERS) {   
    
    if(this.constructor.instance) {
        return this.constructor.instance;
    }

    const instance = this;

    Object.defineProperty(this.constructor, 'instance', {
        get() {
            return instance;
        }
    });


    function ValueWrapp(sType, value) { /*Wrapper for the value being encoded*/
        this.JSONdecodeType = sType;
        this.JSONdecodeValue = value;
    }
     
    const handlers = new Map();    

    const convert = value => {
        const type = value?.constructor?.name;
            
        if( handlers.has(type) ) {                
            return new ValueWrapp(type, handlers.get(type).e(value));
        }

        return  value;
    }        

    const toOriginal = value => {
        if(value?.JSONdecodeType) {
            return handlers.get(value.JSONdecodeType).d(value.JSONdecodeValue);
        }

        return value;
    };



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
    

    this.addHandlers = arr => {
        arr.reduce((acc, [name, e, d]) => acc.set(name, {e, d}), handlers);        
        return this;
    }

    this.removeAll = () => {
        handlers.clear();
        return this;
    }

    this.removeByName = (...typeName) => { /*remove handler by name*/
        typeName.forEach(name => handlers.delete(name))
        return this;
    }

    this.newHandlers = arr => { /*remove all and add new handlers */
        handlers.clear();
        this.addHandlers(arr);

        return this;
    };

    this.replaceHandler = ({n, e, d}) => {
        
        const h = handlers.get(n);

        if(h) {
            (typeof e === 'function') && (h.e = e);
            (typeof d === 'function') && (h.d = d);
        }

        return this;        
    };

    this.getTypeNames = () => [...handlers.keys()];

    this.hasType = typeStr => handlers.has(typeStr);    

    this.hasVlueType = value => handlers.has(value?.constructor?.name)


    this.addHandlers(typeHandlers);   
};

export {customJSON, isVoid};

