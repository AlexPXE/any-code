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
    
    const heapify = (arr, i, heapSize = arr.length) => {

        const left = 2 * i + 1;
        const right = left + 1;
        let largest = i;        
        
        if (left < heapSize && arr[largest] < arr[left]) {           
            largest = left;
        }

        if(right < heapSize && arr[largest] < arr[right]) {
            largest = right;
        }

        return i !== largest ? heapify( swap(arr, i, largest), largest, heapSize) : arr;        
    };

    const buildHeap = arr => { 

        let i = Math.floor(arr.length / 2);

        while(i) {
            heapify(arr, --i);
        }

        return arr;
    };   

    return arr => {
        let heapSize = arr.length;

        buildHeap(arr);
        
        while(--heapSize) {            
            heapify( swap(arr, 0, heapSize), 0, heapSize );           
        }

        return arr;
    }    
})();


export {heapSort};