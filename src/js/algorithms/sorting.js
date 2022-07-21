"use strict";
/**
 * Sorting algorithms.
 * @module sorting
 */

/**
 * The heapSort() function sorts an array of elements in ascending order.
 * @param {any[]} arr Array of numbers to be sorted.
 * @param {function} [compare = (a, b) => a < b] Function to compare two elements.
 * @returns {any[]} Sorted array.
 * @static
 */
const heapSort = (() => {

    const swap = (arr, a, b) => {
        [arr[a], arr[b]] = [arr[b], arr[a]];
        return arr;
    };

    const defaultCompare = (a, b) => a < b;
    
    const heapify = (arr, i, heapSize, callback) => {

        const left = 2 * i + 1;
        const right = left + 1;
        let largest = i;
        
        if(!heapSize) {
            heapSize = arr.length;
        }
        
        if ( left < heapSize && callback(arr[largest], arr[left]) ) {           
            largest = left;
        }

        if( right < heapSize && callback(arr[largest], arr[right]) ) {
            largest = right;
        }

        return i !== largest ? heapify( swap(arr, i, largest), largest, heapSize, callback) : arr;        
    };

    const buildHeap = (arr, callback) => { 

        let i = Math.floor(arr.length / 2);

        while(i) {
            heapify(arr, --i, null, callback);
        }

        return arr;
    };   

    return (arr, compare = defaultCompare) => {
        console.time('HeapSort');
        let heapSize = arr.length;

        buildHeap(arr, compare);
        
        while(--heapSize) {            
            heapify( swap(arr, 0, heapSize), 0, heapSize, compare);        
        }

        console.timeEnd('HeapSort');
        return arr;
    }    
})();



const shellSort = (() => {
    
    const defaultCompare = (a, b) => a < b;

    const defaultHCallback = len => Math.floor(len / 2);

    const swap = (arr, a, b) => {
        [arr[a], arr[b]] = [arr[b], arr[a]];
        return arr;
    };

    

    return (arr, compare = defaultCompare, hCallback = defaultHCallback) => {

    };
    

})();

function shellSort(arr, hCallback) {
    let len = arr.length;  

    const step = (ss) => {        
        return ~~hCallback(ss) || 1;
    };

    return function sort( n = step(len) ) {

        for (let i = n; i < len; i++) {        
            for(let b = i, s = i - n; s >= 0 && arr[b] < arr[s];) {
                [arr[b], arr[s]] = [arr[s], arr[b]];
                b = s;                                             
                s -= n;                                            
            }
        }

        if (n > 1) {
           return sort(step(n));
        }
            console.log('shellSort', arr);
    };
}



//arra with random numbers
function generateRandomArray(size, max) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * max));
    }
    return arr;
}

const arrA = generateRandomArray(10000000, 10000);

const arrB = [...arrA];


heapSort(arrA);

console.time('sort');
arrB.sort((a, b) => a - b);
console.timeEnd('sort');


export {heapSort};


