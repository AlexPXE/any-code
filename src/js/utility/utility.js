

'use strict';

/**
 * Different utility functions and classes etc...
 * @module utility
 */


const {isVoid} = new function() {
    const voidValues = new Set([undefined, null, NaN, Infinity, -Infinity]);

    this.isVoid = (value) => {
        return voidValues.has(value);
    }
};

const {JSONencode} = new function() {

    const {handler} = new function() {

        function ValueWrapp(sType, value) { /*Wrapper for the value being encoded*/
            this.JSONdecodeType = sType;
            this.value = value;
        }
        
        const typesHandlers = { /*Processed types (class construtors names) and handlers*/
            'Map': value => new ValueWrapp('Map', [...value]),
            'Set': value => new ValueWrapp('Set', [...value]),
            'BigInt': value => new ValueWrapp('BigInt', `${value.toString()}`),
        };
        
        this.handler = value => { /*Main type handler */
            return typesHandlers[value?.constructor.name]?.(value) || value; /*The name of the constructor is the name of the handler*/
        }
    };

    const cbFactory = replacer => {     /*JSON.stringify callback factory*/

        if( isVoid(replacer) ) {        /*If there is no replacer*/
            return function(key, value) {
                return handler(value);
            };
        }

        if( typeof replacer === 'function' ) {
            return function(key, value) {
                return handler( replacer(key, value) );
            };
        }

        if(replacer?.[Symbol.iterator]) {    /*If replacer is an iterable*/
            const inclProps = new Set(replacer);

            return function(key, value) {
                
                console.log(key, value);
                if( inclProps.has(key) ) {
                    return handler(value);
                } 

                return '';
            }
        }        
    }

    this.JSONencode = (value, replacer, space) => {        
        return JSON.stringify(value, cbFactory(replacer), space);
    }
};






const bb = {
    a: {
        b: 1,
        c: 2,
    },
    b: 23,
    c: 3,
    d: 4,
    e: new Map([
        ['f', 5],
        ['g', 6],
        ['h', 7],
    ]),
    
};



//console.log(JSONencode(bb, ['a', 'b', 'c']) );

console.log(JSON.stringify(bb, function(key, value) {
    console.log(key, typeof key);
    if(key === 'b') {
        console.log(value);
        return value;
    }
    return value;
},2) );


