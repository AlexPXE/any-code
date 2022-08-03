

/**
 * The counters module provides functions and classes for working with various 
 * [premutation, combination of elements, etc.](https://en.wikipedia.org/wiki/Combinatorics)
 * @module counters
 */

const UINT8_MAX = 255;
class CounterBuilder {
    /**
     * Array of dictionaries.
     * @type {Array}
     */
    dict = [];
    /**
     * Array of start positions for each counter.
     */
    startPos = [];    

    static #dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

    /**
     * CounterBuilder class.
     * @static
     */
    constructor() {

    }

    /**
     * This method returns a function that calls the CounterBuilder.prototype.permut() method
     * with the parameters given by the [CounterBuilder.prototype.addCounter() method.]{@link module:counters~CounterBuilder#addCounter}
     * 
     * @returns {function}  
     * ```JavaScript      
     *      (callback = set => false) => this.permut(dict, counters, rangeLimit, set, callback);
     * ```
     */
    create() {
        const dict = this.dict;
        const rangeLimit = this.dict.map(d => d.length);
        const set = [];

        const counters = Math.max(...rangeLimit) > UINT8_MAX ? 
            new Uint32Array(rangeLimit.length) : 
            new Uint8Array(rangeLimit.length);       
        
        this.startPos.forEach((start, i) => {
            counters[i] = start;
            set[i] = dict[i][start];
        });
        
        this.dict = [];
        this.startPos = [];

        return (callback = set => false) => this.permut(dict, counters, rangeLimit, set, callback); 
    }   
    
    /**
     * The CounterBuilder.prototype.addCounter() method adds dictionary and start position to the builder.
     * @param {Array|string} [dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890']  Array or string of 
      elements for iteration. Max length is __`2**32 - 1`__.

     * @param {Number} [start = 0] Iteration start position index.
     * @returns {CounterBuilder} This instance of the CounterBuilder class.
     * @throws {Error} If the length `dict` parameter is not a array-like object or string or `dict` is empty.
     * @throws {Error} If the `start` parameter is not a number or `start`parameter out of range [ `0`; `dict.length - 1` ]
     */
    addCounter(dict = CounterBuilder.#dict, start = 0) {
        
        if( !(dict?.length > 0) ) {
            throw new Error(`Invalid argument dict = ${dict}. It must be a non-empty string or an array-like object`);
        }

        if( (typeof start !== 'number') || dict[start] === undefined ) {
            throw new Error(`Invalid argument start = ${start}. It must be a number in range [0; dict.length - 1]`);
        }

        this.dict.push(dict);
        this.startPos.push(start);
        return this;
    }

    /**
     * CounterBuilder.prototype.permut() iterates over all 
      [possible combinations of dictionary elements.](https://en.wikipedia.org/wiki/Permutation#Permutations_with_repetition)
      Each cell of the `set` array must correspond to an array or a string from the `dict` array. 
     * 
     * @param {Array.<Array>|Array.<string>} dict Array of strings or arrays to iterate ( `[['dict1'], ['dict2'], [1, 2, 3] ]` ).
       The maximum length of each array (string) must not exceed __`2**32 - 1`__.
     * @param {Uint32Array|Uint8Array} counters The current indexes of the elements of the combination.
     * @param {Array<Number>} rangeLimit An array with the length of each dictionary.
     * @param {Array} set The `set` parameter is passed to the callback after each change, 
      each time representing a new combination of elements from the dictionaries
     * @param {function} callback A callback that is called after each combination change, 
      which will be passed an array with the current elements of the combination. Callback must return `true` to stop the iteration.
     * @returns {Array} The array of the current combination.
     */
    permut(dict, counters, rangeLimit, set, callback) {
        const firstC = counters.length - 1;
        const lastSet = rangeLimit.map((v, i) => dict[i][v - 1]);
        const lastC = 0;
        const loop = true;        
        let indC = firstC;

        while(loop) {

            while(counters[firstC] < rangeLimit[firstC]) {

                set[firstC] = dict[firstC][counters[firstC]];
        
                if(callback(set)) {
                    return set;
                }

                counters[firstC]++;
            }

            while(counters[indC] === rangeLimit[indC]) {

                if(indC === lastC) {
                    return lastSet;
                }
                
                counters[indC] = 0;
                set[indC] = dict[indC][counters[indC]];
                indC--;
                counters[indC]++;
            }
        
            set[indC] = dict[indC][counters[indC]];

            if(callback(set)) {
                return set;
            }

            counters[firstC]++;
            indC = firstC;
        }
    }
}



export {CounterBuilder}



//???: delete this line after testing
/*
const alp = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const alpLen = alp.length;
const temp = [];
const pass = [];
const brut = new Set();
const dict = [];
const K = 6;

for(let i = 0; i < K; i++) {
    //pass.push(alp[Math.floor(Math.random() * alpLen)]);
    dict.push([...alp].sort((a, b) => Math.random() - 0.5));    
    temp.push(dict[i][0]);
    pass.push(dict[i][Math.floor(Math.random() * alpLen)]);
}

brut.add(pass.join(''));

console.log(dict, temp,pass.join(''));

console.time('premRep');
premRep(alpLen, K, (c, len, set) => {    

    while(c < len) {
        temp[c] = dict[c][set[c]];
        c++;
    }    

    return brut.has(temp.join(''));
});

console.log(temp);
console.timeEnd('premRep');

const counter = new CounterBuilder();

for(let d of dict) {
    counter.addCounter(d);
}

const prem = counter.create();


console.time('builder');
console.log(prem( set => {
     return brut.has(set.join(''));
}));
console.timeEnd('builder');
*/