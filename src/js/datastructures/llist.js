


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
        left: function fromTheHead(callbackFn, node) {
            if(node === null) {
                return null;
            }
            callbackFn(node.data);

            return fromTheHead(callbackFn, node.next);
        },

        right: function fromTheTail(callbackFn, node) {
            if(node === null) {
                return null;
            }
            callbackFn(node.data);

            return fromTheTail(callbackFn, node.prev)
        }
    };
    
    return class Llist {
        #head = null;
        #tail = null;
        #length = 0;

        getLength() {
            return this.#length;
        }

        find(predicate) {
            const foundNode = findNode(predicate, this.#head);
            return foundNode === null ? foundNode : foundNode.data; 
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

            traversal.left(value => {
                acc = callbacFn(acc, value);
            }, startNode);

            return acc;
        }

        swap(predicateA, predicateB) {
            const nodeA = findNode(predicateA, this.#head);
            const nodeB = findNode(predicateB, this.#head);

            if(nodeA === null || nodeB === null) {
                return false;
            }

            const temp = nodeA.data;
            nodeA.data = nodeB.data;
            nodeB.data = temp;

            return true;
        }

        delete(predicate) {
            return this.#removeNode( findNode(predicate, this.#head) );
        }

        delByIndex(index) {            
            return this.#removeNode( this.#findByindex(index) );
        }

        deleteByValue(value) {
            return this.delete(v => value === v);
        }

        getByIndex(index) {
            const node = this.#findByindex(index);
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

        destroy() {
            this.#head = null;
            this.#tail = null;
            this.#length = 0;

            return this;
        }

        #findByindex(index) {
            if(Math.floor(this.#length / 2) > index) {                
               return findByInd.right(0, index)(this.#head);
            } else {                
                return findByInd.left(this.#length - 1, index)(this.#tail);
            }
        }
    }
})();

export {DLList};