"use strict";

import { Vertex, Edge, Graph } from "./datastructures/graph.js";
import { MaxBinHeap } from "./datastructures/heaps.js";
import { random, fastPow, modExp, modExpRecur, gcd, eulert } from './math/math.js';



let any = 25 * 31;

console.log(eulert(any), eulert(25), eulert(31));
