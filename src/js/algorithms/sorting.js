"use strict";
/**
 * Sorting algorithms.
 * @module sorting
 */
/**
 * The heapSort() function sorts an array of numbers using the heap sort algorithm.
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

    return (arr, callback = defaultCompare) => {
        let heapSize = arr.length;

        buildHeap(arr, callback);
        
        while(--heapSize) {            
            heapify( swap(arr, 0, heapSize), 0, heapSize, callback);        
        }

        return arr;
    }    
})();


const arr = [];

console.log(heapSort(['zz', 'ff', 'jj']));

export {heapSort};


