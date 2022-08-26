//Heap
"use strict";
/**
 * Heaps
 * @module heaps
 */
class MaxBinHeap {  
      
    /**
     * Creates a new MaxBinHeap instance.
     * 
     * @param {any[]} [arr = []] Array of elements to build heap from.
      Default is empty array. Values in the array must support the < operator.
     */
    constructor(arr = []) {
       /**
        * @property {any[]} arr For storing heap elements.
        */
        this.arr = arr;

        /**
         * @property {number} heapSize The number of elements in the heap.
         */
        this.heapSize = arr.length;

        this.buildHeap();
    }    

    /**
     * *[Symbol.iterator] Specifies the function to call when the object is used as an iterable.
     * @param {string} hint 
     */
    *[Symbol.iterator](hint) {
        let {heapSize, arr} = this;
        for (let i = 0; i < heapSize; i++) {
            yield arr[i];
        }        
    }    

    /**
     * A method that checks if the given index is in the bounds of the heap.
     * @param {number} index Index of the element to be checked. 
     * @returns {boolean} Returns true if the index is in the bounds of the heap.
     */
    checkIndex(index) {                        
        return (Number.isInteger(index) && (index >= 0) && (index < this.heapSize));
    }

    /**
     * This method will compare the value of the element at the given index 
      with the values ​​of its child elements and return the index of the element with the largest value.
     * @param {number} index Index of the element whose largest child is to be found.
     * @returns {number} Index of the largest element.
     */
    largest(index) {
        if(!this.checkIndex(index)) {            
            throw new RangeError(`Heap.largest(${index}): Index out of range! heapSize === ${this.heapSize}`);
        }
        
        const { arr } = this;
        const left = this.getLeftChild(index);
        const right = this.getRightChild(index);
        let largestIndEl = index;        

        if(this.checkIndex(left)) {

            if(arr[left] > arr[largestIndEl]) {
                largestIndEl = left;
            }        
            
            if(this.checkIndex(right)) {
                if(arr[right] > arr[largestIndEl]) {
                    largestIndEl = right;
                }
            }
        }

        return largestIndEl;
    }

    /**     
     * A method that returns the value of the element at the given index 
     without deleting the element itself.
     * @param {number} index The index of the element whose value is to be retrieved
     * @returns {any} Value of the element at the given index
     */
    getValue(index) {
        if(!this.checkIndex(index)) {
            throw new RangeError('getValue(): Index out of range!');
        }

        return this.arr[index];
    }
    
    /**
     * A method that builds a heap from an array of elements.
     * @returns {MaxBinHeap} The heap instance.
     */
    buildHeap() {        
        let start = ~~(this.heapSize / 2) - 1;
        try{
            while(this.checkIndex(start)) {
                this.heapify(start--);                        
            }
        }catch({message, name}){
            throw new Error(`${name}: Heap.buildHeap() -> ${message}`);
        }

        return this;
    }   

    /**     
     * A method that adds a new element with the given value to the heap. 
     Does not violate the main heap property.
     * 
     * @param {any} value Value to be inserted.
     * @returns {number} Returns the new heap size.
     */
    insert(value) {     
        if(arguments.length == 0) {
            throw new Error('Heap.push() No arguments!');
        }

        const { arr, heapSize } = this;        

        if (heapSize == arr.length) {
            arr.push(value);
        } else {
            arr[heapSize] = value;
        }

        let current = this.heapSize++;
        let parent = this.getParent(current);

        while ( this.checkIndex(parent) && (arr[parent] < arr[current]) ) {
            try{
                this.swap(parent, current);

            } catch({name, message}) {
                throw new Error(`${name}: Heap.push(${value}) -> ${message} heapSize === ${this.heapSize}`);
            }
            
            current = parent;
            parent = this.getParent(current);
        }

        return this.heapSize;
    }

    /**
     * A method that extracts the element with the maximum value from the heap.
     Does not violate the main heap property.
     * 
     * @returns {any | undefined} the value of the top element of the heap or undefined if the heap is empty
     */
    extract() {
        if(this.heapSize == 0) {
            return undefined;
        }

        const temp = this.arr[0];

        try{            
            this.swap(0, this.heapSize - 1);                       

            if(--this.heapSize > 0) {
                this.heapify(0);
            }         
            
            return temp;

        } catch({message, name}) {
            throw new Error(`${name}: Heap.extractMax() -> ${message} heapSize === ${this.heapSize}`);
        }        
    }

    show() {
        throw new Error(`Heap.show(): Not implemented!`);
    }

    /**
     * A method that returns the index of the parent element of the element at the given index.
     * 
     * @param {number} index 
     * @returns {number | null}
     */
    getParent(index) {          
        let parent = ~~((index - 1 ) / 2);        
        return this.checkIndex(parent) ? parent : null;        
    }

    /**
     * Returns the left child index of the element at the given index of the parent element.
     * 
     * @param {number} index index of elemet
     * @returns {(null|number)} left child indexLeft child index or null if index is out of bounds.
     * 
     */
    getLeftChild(index) {
        const left = index * 2 + 1;
        return this.checkIndex(left) ? left : null; 
    }

    /**
     * Returns the right child index of the element at the given index of the parent element.
     * 
     * @param {number} index index of element
     * @returns {number} Right child index or null if index is out of bounds.
     */
    getRightChild(index) {        
        const right = index * 2 + 2;
        return this.checkIndex(right) ? right : null;
    }

    /**
     * A method that swaps the values ​​of the elements at the given indices.
     This may violate the heap main property.
     * 
     * @param {Number} index1 First index
     * @param {Number} index2 Second index
     * @returns {this} This instance of the MaxHeap class.
     */
    swap(index1, index2) {
        
        if( this.checkIndex(index1) && this.checkIndex(index2) ) {
            const { arr } = this;

            [ arr[index1], arr[index2] ] = 
            [ arr[index2], arr[index1] ];  
        
            //console.debug('swapped:', index1, index2);            
            return this;    
        }

        throw new RangeError(`Heap.swap(${index1}, ${index2}): Index out of range!`);
    }

    /**
     * Heapify the element at the given index.
     * 
     * @param {number} index index of element to be heapified
     * @returns {MaxBinHeap} Returns this object
     */
    heapify(index) {        
        try{
            const largest = this.largest(index);
            if (index != largest) {
                this.swap(index, largest);
                return this.heapify(largest);
            }
            
            return this;          

        } catch({message}) {
           throw new RangeError(`Heap.heapify(${index}) -> ${message} heapSize === ${this.heapSize}`);            
        }        
    }   
}

export { MaxBinHeap };