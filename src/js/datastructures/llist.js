"use strict";

import { isVoid } from "../utility/utility.js";

const DLList = ( function () {
    class Node {
        constructor(value = null) {
            this.data = value;
            this.next = null;
            this.prev = null;
        }
    }

    function findNode(predicate, node) {
        while(node !== null) {
            if( predicate(node.data) ) {
                return node;
            }
            
            node = node.next;
        }

        return node;
    }

    const findByInd = {
        right: function(start, end) {
            return function goRight(node) {

                while(node !== null) {
                    if(start === end) {
                        return node;
                    }
                    start++;
                    node = node.next;
                }

                return node;
            };
        },

        left: function(start, end) {
            return function goLeft(node) {

                while(node !== null) {
                    if(start === end) {
                        return node;
                    }
                    start--;
                    node = node.prev;
                }

                return node;
            };            
        }
    };    

    function insertBefore(node, value) {        
        const newNode = new Node(value);
        
        if(node !== null) {
            newNode.next = node;
            node.prev = newNode;
        }        
        return newNode;
    }

    function insertAfter(node, value) {
        const newNode = new Node(value);

        if(node !== null) {
            node.next = newNode;
            newNode.prev = node;
        }
        return newNode;
    }

    const traversal = {
        left: function fromTheHead(callbackFn, node, index = 0) {
            if(node === null) {
                return null;
            }
            callbackFn(node.data, index);

            return fromTheHead(callbackFn, node.next, ++index);
        },

        right: function fromTheTail(callbackFn, node, index = 0) {
            if(node === null) {
                return null;
            }
            callbackFn(node.data, index);

            return fromTheTail(callbackFn, node.prev, --index)
        }
    };

    function swapValues(nodeA, nodeB) {
        if(nodeA === null || nodeB === null) {
            return false;
        }

        const temp = nodeA.data;
        nodeA.data = nodeB.data;
        nodeB.data = temp;

        return true;
    }
    
    return class DLList {
        #head = null;
        #tail = null;
        #length = 0;

        *[Symbol.iterator]() {
            let node = this.#head;

            while(node !== null) {
                yield node.data;
                node = node.next;
            }
        }

        getLength() {
            return this.#length;
        }

        getHeadValue() {
            if(this.#length === 0) {
                return null;
            }

            return this.#head.data;
        }

        getTailValue() {
            if(this.#length === 0) {
                return null;
            }            
            return this.#tail.data;
        }

        find(predicate) {
            const foundNode = findNode(predicate, this.#head);            
            return foundNode === null ? foundNode : foundNode.data; 
        }

        filter(callbackFn) {
            return this.reduce((acc, value) => {
                if( callbackFn(value) ) {
                    acc.push(value);
                }

                return acc;
            }, new DLList() );
        }

        slice(start, end) {
            const result = new DLList();
            const length = this.#length;
            const args =  arguments.length;
            let startNode;
            let direction;
            let increment;


            if (length !== 0) {

                if(args === 1) {                    
                    end = length - 1;

                } else if(args === 0) {
                    start = 0;
                    end = length - 1;

                } else if ( isVoid(start) || isVoid(end) || start % length !== start ) {                    
                    return result;
                }

                if (start < 0) {
                    start = length + start;
                }

                if (end < 0) {
                    end = length + end;
                }

                if (start < end) {
                    direction = 'next';
                    increment = 1;
                } else {
                    direction = 'prev';
                    increment = -1;
                }

                startNode = this.#findByIndex(start);

                while (startNode !== null) {
                    result.push(startNode.data);
                    startNode = startNode[direction];

                    if (start === end) {
                        break;
                    }

                    start += increment;
                }
            }


            return result;
        }

        reduce(callbacFn, initialValue) {
            if(this.#length === 0) {
                return initialValue;
            }

            let acc;
            let startNode;

            if(arguments.length === 1) {
                acc = this.#head.data;
                startNode = this.#head.next;
                
            } else {
                acc = initialValue;
                startNode = this.#head;
            }

            traversal.left((value, index) => {
                acc = callbacFn(acc, value, index);
            }, startNode);

            return acc;
        }

        traversal(callbacFn, direction = 'left') {            
            if(direction === 'left') {
                traversal[direction](callbacFn, this.#head, 0);

            } else {
                traversal[direction](callbacFn, this.#tail, this.#length - 1);
            }

            return this;
        }

        swap(predicateA, predicateB) {            
            return swapValues( 
                findNode(predicateA, this.#head), 
                findNode(predicateB, this.#head)
            );
        }

        delete(predicate) {
            return this.#removeNode( findNode(predicate, this.#head) );
        }

        delByIndex(index) {            
            return this.#removeNode( this.#findByIndex(index) );
        }

        deleteByValue(value) {
            return this.delete(v => value === v);
        }

        getByIndex(index) {
            const node = this.#findByIndex(index);
            return node === null ? node : node.data;
        }

        push(value) {

            this.#tail = insertAfter(this.#tail, value);
            
            if(this.#length === 0) {
                this.#head = this.#tail;
            }

            this.#length++;
            return this;
        }

        pop() {             
            if(this.#length === 0) {
                return null;
            }

            const node = this.#tail;

            if(this.#length === 1) {                
                this.#head = null;
                this.#tail = null;
            } else {
                this.#tail = node.prev;
            }

            this.#length--;
            return node.data;
        }

        unshift(value) {
            this.#head = insertBefore(this.#head, value);
            
            if(this.#length === 0) {
                this.#tail = this.#head;
            }

            this.#length++;
            return this;
        }

        shift() {
            if(this.#length === 0) {
                return null;
            }

            const node = this.#head;

            if(this.#length === 1) {
                this.#head = null;
                this.#tail = null;
            } else {
                this.#head = node.next;
            }

            this.#length--;
            return node.data;
        }

        destroy() {
            this.#head = null;
            this.#tail = null;
            this.#length = 0;

            return this;
        }

        #removeNode(node) {
            if(node === null) {
                return false;
            }

            const {prev, next} = node;

            if(prev === null) {
                this.#head = next;
            } else {
                prev.next = next;
            }

            if(next === null) {
                this.#tail = prev;
            } else {
                next.prev = prev;
            }

            this.#length--;

            return true;
        }

        #findByIndex(index) {
            if(Math.floor(this.#length / 2) > index) {                
               return findByInd.right(0, index)(this.#head);
            } else {                
                return findByInd.left(this.#length - 1, index)(this.#tail);
            }
        }
    }
})();



export {DLList};