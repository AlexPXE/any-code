

/**
 * The counters module provides functions and classes for working with various 
 * [premutation, combination of elements, etc.](https://en.wikipedia.org/wiki/Combinatorics)
 * @module counters
 */

const UINT8_MAX = 255;

//TODO: Need to test!
class CounterBuilder {
    /**
     * Array of dictionaries.
     * @type {Array}
     */
    dicts = [];
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

        this.dicts.push(dict);
        this.startPos.push(start);
        return this;
    }

    /**
     * This method returns a function that calls the CounterBuilder.prototype.permut() method
     * with the parameters given by the [CounterBuilder.prototype.addCounter() method.]{@link module:counters~CounterBuilder#addCounter}
     * 
     * @returns {function}  
     * ```JavaScript      
     *      (callback = set => false) => this.permut(dicts, startPos, predicateFn);
     * ```
     */
     create() {
        const dicts = this.dicts;        
        const startPos = this.startPos;

        this.dicts = [];
        this.startPos = [];

        return (predicateFn = set => false) => this.permut(dicts, startPos, predicateFn); 
    }


    //TODO: Make the function independent of the class or make it private
    /**
     * CounterBuilder.prototype.permut() iterates over all 
      [possible combinations of dictionary elements.](https://en.wikipedia.org/wiki/Permutation#Permutations_with_repetition)
      Each cell of the `set` array must correspond to an array or a string from the `dict` array. 
     * 
     * @param {Array.<Array>|Array.<string>} dicts Array of strings or arrays to iterate ( `[['dict1'], ['dict2'], [1, 2, 3] ]` ).
       The maximum length of each array (string) must not exceed __`2**32 - 1`__.          
     * @param {Array} startPositions Initial positions of counters.
      each time representing a new combination of elements from the dictionaries
     * @param {function} predicateFn A callback that is called after each combination change, 
      which will be passed an array with the current elements of the combination. Callback must return `true` to stop the iteration.
     * @returns {Array} The array of the current combination.
     */
      permut(dicts, startPositions, predicateFn) {

        const rangeLimit = dicts.map(d => d.length);        

        const counters = Math.max(...rangeLimit) > UINT8_MAX ? 
            new Uint32Array(rangeLimit.length) : 
            new Uint8Array(rangeLimit.length);

        const set = [];        
        const lastSet = rangeLimit.map((v, i) => dicts[i][v - 1]);
        const loop = true;
        const indexFirstCntr = counters.length - 1;
        const indexLastCntr = 0;
        let indexCurrCntr = indexFirstCntr;

        startPositions.forEach((start, i) => {
            counters[i] = start;
            set[i] = dicts[i][start];
        });

        while(loop) {

            while(counters[indexFirstCntr] < rangeLimit[indexFirstCntr]) {

                set[indexFirstCntr] = dicts[indexFirstCntr][ counters[indexFirstCntr] ];
        
                if( predicateFn(set) ) {
                    return set;
                }

                counters[indexFirstCntr]++;
            }

            while(counters[indexCurrCntr] === rangeLimit[indexCurrCntr]) {

                if(indexCurrCntr === indexLastCntr) {
                    return lastSet;
                }
                
                counters[indexCurrCntr] = 0;
                set[indexCurrCntr] = dicts[indexCurrCntr][ counters[indexCurrCntr] ];
                indexCurrCntr--;
                counters[indexCurrCntr]++;
            }
        
            set[indexCurrCntr] = dicts[indexCurrCntr][ counters[indexCurrCntr] ];

            if( predicateFn(set) ) {
                return set;
            }

            counters[indexFirstCntr]++;
            indexCurrCntr = indexFirstCntr;
        }
    }
}

export {CounterBuilder}