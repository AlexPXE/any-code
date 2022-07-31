

const UINT8_MAX = 255;

const premRep = (n, k, callback = (cellNumber, len, set ) => set) => {
    
    if(n <= 0 || k <= 0 || !(callback instanceof Function)) {
        throw new Error(`Invalid arguments n = ${n}, k = ${k}, callback = ${callback}`);
    }
    
    const set = n > UINT8_MAX ? new Uint32Array(k) : new Uint8Array(k);
    const firstCell = k - 1;
    const lastCell = 0; 
    
    let loop = true;    
    let cellInd = firstCell;
    let counter = 0;
    

    while (loop) {        

        while (set[firstCell] < n) {
            
            if (callback(firstCell, k, set)) {
                return true;
            }

            set[firstCell]++;
            counter++;
        }

        /** reset cells on overflow*/        
         while(set[cellInd] === n) { 
            
            /** 
             * if cellInd is the last cell (cellInd === 0), return//???
             */
            if(cellInd === lastCell) {
                return false;
            }
            /**
             * reset cell value and move to next cell and increment its value
             */
            set[cellInd--] = 0;
            set[cellInd]++;
        }
        
        if (callback(cellInd, k, set)) {
            return true;
        }
        
        counter++;
        set[firstCell]++;        
        cellInd = firstCell;
    }

    return counter;
};


class CounterBuilder {

    #defaultCallback = set => false;
    #defaultOptions = [{alph: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], startInd: 0}];
    callback = this.#defaultCallback;            
    options = [];
    

    constructor() {        
    }



    *#counter(options, set, cellNumber) {
        
        if(cellNumber > -1) {
            const nextCell = this.#counter(options, set, cellNumber - 1);            
            const {alph, startInd} = options[cellNumber];
            const alphLen = alph.length;
            let a = startInd + 1;

            do {
                
                while(a < alphLen) {
                    set[cellNumber] = alph[a++];                     
                    yield true;
                }
                a = 0;

            }while(nextCell.next().value)          


        } else {
            yield false;
           
        }
    }

    reset() {
        this.options = this.#defaultOptions;
        this.callback = this.#defaultCallback;
    }

    *create() {
        const options = this.options.length > 0 ? this.options : this.#defaultOptions;
        const set = [];
        const counter = this.#counter(options, set, options.length - 1);
        const {callback} = this;        
        
        for(let {startInd, alph} of options) {
            set.push(alph[startInd]);
        }

         do {           

            if(callback(set) === true) {                
                console.log(set);
                return true;
            }
            
            yield false;
        } while(counter.next().value)
    }

    addCounter(alph, startInd = 0) {        

        if( !(alph instanceof Array) && !(typeof alph === 'string') ) {
            throw new TypeError('First argument must be an array or string');
        }

        if(typeof startInd !== 'number') {
            throw new TypeError('Second argument must be a positive number');
        }

        if(startInd < 0 || startInd > alph.length) {
            throw new RangeError('arguments[1] must be >= 0 and < arguments[0].length');
        }

        
        this.options.push({alph, startInd});
        return this;
    }

    addCallback(callback) {
        if(!(callback instanceof Function)) {
            throw new TypeError('Argument must be a function');
        }

        this.callback = callback;        
        return this;
    }
}





const alp = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const alpLen = alp.length;
const temp = [];
const pass = [];
const brut = new Set();
const dict = [];
const K = 5;

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



const test = new CounterBuilder()
    .addCallback(set => brut.has(set.join('')))
    
for(let i = 0; i < K; i++) {
    test.addCounter(dict[i]);
}


const counter = test.create();

console.time('counter');
while(counter.next().done === false) {    
}
console.timeEnd('counter');


