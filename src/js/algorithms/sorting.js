"use strict";
/**
 * Sorting algorithms.
 * @module sorting
 */


/*
    TODO: 
    [ ] 1. quickSort 
    [x] 2. insSort
*/

class Sorting {    
    
    constructor(obj) {

        if(!(obj?.sort instanceof Function)) {
            throw new Error('Requires "sort" method.');
        }

        Object.assign(this, obj);
    }

    swap(arr, a, b) {
        [arr[a], arr[b]] = [arr[b], arr[a]];
        return arr;
    }  
    
}


class SortingFactory {
    static #instance = null;

    constructor() {
        if(this.constructor.#instance === null) {
            return this.constructor.#instance = this;
        }

        return this.constructor.#instance;
    }
    
    static randomArr(size, max) {
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(Math.floor(Math.random() * max));
        }
    
        return arr;
    }

    #isFunction(func) {
        return func instanceof Function ? func : this.defaultCompare
    }

    defaultCompare(a, b) {
        return a < b;
    }

    build(name, copyArray = false, compare, ...args) {
        return arr => this[name].sort( copyArray ? [...arr] : arr, this.#isFunction(compare), ...args );
    }

    addSorting(name, obj) {
        this[name] = new Sorting(obj);
        return this;
    }
}


const sortingFactory = new SortingFactory()
    .addSorting('heap sorting', {

        heapify(arr, ind, heapSize, compare) {
            const left = 2 * ind + 1;
            const right = left + 1;
            let largest = ind;
            
            if(!heapSize) {
                heapSize = arr.length;
            }
            
            if ( left < heapSize && compare(arr[largest], arr[left]) ) {           
                largest = left;
            }
    
            if( right < heapSize && compare(arr[largest], arr[right]) ) {
                largest = right;
            }
    
            return ind !== largest ? this.heapify( this.swap(arr, ind, largest), largest, heapSize, compare) : arr; 
        },
    
        buildHeap(arr, compare) {
            let ind = Math.floor(arr.length / 2);
    
            while(ind) {
                this.heapify(arr, --ind, null, compare);
            }
    
            return arr;
        },
    
        sort(arr, compare) { 
            
            let heapSize = arr.length;
    
            this.buildHeap(arr, compare);
            
            while(--heapSize) {            
                this.heapify( this.swap(arr, 0, heapSize), 0, heapSize, compare);        
            }

            return arr;
        },


    })
    .addSorting('Shell sorting', {

        defaultHCallback(len) { 
            return Math.floor(len / 2)
        },

        *stepGenerator(callback, len) {
            let step = len;
    
            while(step > 1) {            
                step = callback(step) || 1;            
                yield step;
            }        
        },

        sorting(arr, compare, stepGen) {
        
            const {value: step} = stepGen.next();
            
            const len = arr.length;        
            
            let b = 0;
            let a = 0;
            let i = step;
    
            while (i < len) {            
                 b = i;
                 a = i - step;
    
                while( a >= 0 && compare(arr[b], arr[a]) ) {
                    this.swap(arr, a, b);
                    b = a;                                             
                    a -= step;
                }
    
                i++;
            }
            
            if (step > 1) {
                return this.sorting(arr, compare, stepGen);
            }
            
            return arr;        
        },

        sort(arr, compare, hCallback  = this.defaultHCallback) {            
            return this.sorting(arr, compare, this.stepGenerator(hCallback, arr.length));
        }

    })
    .addSorting('insertion sorting', {
        sort(arr, compare) {

            const len = arr.length;
            let key = 0;
            let j = 1;
            let i = 0;
        
            while( ++j < len ) {        
                key = arr[j];
                i = j;

                while( i-- > 0 && compare(key, arr[i]) ) { 
                    arr[i + 1] = arr[i];
                }

                arr[i + 1] = key;
            }

            return arr;
        }
    })
    .addSorting('heap test', {
        sort(arr, compare) {
            let ind = Math.floor(arr.length / 2);
    
            while(ind) {
                if(ind > 0 && compare(arr[ind], arr[ind - 1])) {
                    this.swap(arr, ind, ind - 1);
                }

                sortingFactory['heap sorting'].heapify(arr, --ind, null, compare);
            }
    
            return arr;
        }
    });

sortingFactory.addSorting('test sorting', {
    heapify: sortingFactory['heap sorting'].heapify,
    buildHeap: sortingFactory['heap sorting'].buildHeap,
    insSort: sortingFactory['insertion sorting'].sort,

    sort(arr, compare) {        
        return this.insSort(this.buildHeap(arr, (a, b) => a > b), compare);
    }
});
    




const arr = SortingFactory.randomArr(100000, 1000);


const arrA = [...arr]
const arrB = [...arr];
const arrC = [...arr];
const arrD = [...arr];


const sSort = sortingFactory.build('Shell sorting');
const hSort = sortingFactory.build('heap sorting');
const iSort = sortingFactory.build('insertion sorting');
const test = sortingFactory.build('test sorting');
const hTest = sortingFactory.build('heap test', false, (a, b) => a > b);



/*
console.time('test');
test(arrD);
console.timeEnd('test');
*/
console.time('iSort')
iSort( hTest( hTest(arrC) )  );
console.timeEnd('iSort');


console.time('iSortA')
iSort(arrD);
console.timeEnd('iSortA');



console.time('sSort');
sSort(arrA); 
console.timeEnd('sSort');

console.time('hSort');
hSort(arrB);
console.timeEnd('hSort');



