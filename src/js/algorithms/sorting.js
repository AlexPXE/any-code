"use strict";
/**
 * Sorting algorithms.
 * @module sorting
 */


//???: class Sortings
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
    .addSorting('heapSort', {

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
    .addSorting('shellSort', {

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

    });
















const sorting = (() => {
    
    return {

    };
})();




const quickSort = (() => {
    
})();



const insSort = (() => {

    const sort = (arr, compare) => {
        const len = arr.length;
        let key = 0;
        let j = 1;
        let i = 0;
    
        while(j < len) {        
            key = arr[j];
            i = j;

            while(--i > 0 && arr[i] > key) {
                arr[i + 1] = arr[i];
            }
        }
    };
})();


//array with random numbers
function generateRandomArray(size, max) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * max));
    }

    return arr;
}





const arrA = SortingFactory.randomArr(30, 10);


const arrB = [...arrA];


const sSort = sortingFactory.build('shellSort');
const hSort = sortingFactory.build('heapSort');


console.log(sSort(arrA), hSort(arrB));




