"use strict";

import { Vertex, Edge, Graph } from "./datastructures/graph.js";
import { MaxBinHeap } from "./datastructures/heaps.js";

/** 
 *Variable
 * [MaxHeap]{@link module:Heaps~MaxHeap} 
 * @type {MaxBinHeap} 
 */
const heap = new MaxBinHeap();


/**
 * @typedef {Object} myType
 * @property {number} a
 * @property {string} b
 */

/**
 * @type {myType}
 */
const f = {
    a: 1,
    b: '2'
};


/**
 * 
 * @param {{a: number, b: string}} numbers 
 */
function foo({a, b}) {
    console.log(a, b);
}

const z = {
    a: 1,
    b: '2'
};



console.log('heap:', ...heap);


console.log(heap.insert(1111));

console.log('heap:', ...heap);

console.log(heap.extract());


console.log('heap:', ...heap);

foo(f);

