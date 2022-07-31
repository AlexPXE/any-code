

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
    dict = [];
    startPos = [];
    defCallback = set => false;
    

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

        return (callback = this.defCallback) => this.premRep(dict, counters, rangeLimit, set, callback); 
    }   
    

    addCounter(dict, start = 0) {
        this.dict.push(dict);
        this.startPos.push(start);
        return this;
    }

    premRep(dict, counters, rangeLimit, set, callback) {
        const firstC = counters.length - 1;
        const lastC = 0;
        const loop = true;
        let indC = firstC;
        let counter = 0;
        

        while(loop) {

            while(counters[firstC] < rangeLimit[firstC]) {

                set[firstC] = dict[firstC][counters[firstC]];
                counter++;
                if(callback(set)) {
                    return set;
                }

                counters[firstC]++;
            }

            while(counters[indC] === rangeLimit[indC]) {

                if(indC === lastC) {
                    return counter;
                }
                
                counters[indC] = 0;
                set[indC] = dict[indC][counters[indC]];
                indC--;
                counters[indC]++;
            }

            counter++;
            set[indC] = dict[indC][counters[indC]];
            if(callback(set)) {
                return set;
            }

            counters[firstC]++;
            indC = firstC;
        }
    }
    
}




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
