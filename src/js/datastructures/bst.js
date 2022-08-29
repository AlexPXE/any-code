import { DLList } from "./llist.js";

const AVLTreeBuilder = ( function() {
    

    const nodePrototype = {
        rHeight: function () {
            if(this.right === null) {
                return 0;
            }

            return this.right.height;
        },

        lHeight: function () {
            if(this.left === null) {
                return 0;
            }

            return this.left.height;
        },

        bfactor: function () {
            return ( this.rHeight() - this.lHeight() );
        },

        adjustH: function () {
            return this.height = Math.max( this.rHeight(), this.lHeight() ) + 1;
        },

        getData: function () {
            return this.data;
        },

        setData: function (value) {
            this.data = value;
            return this;
        }
    };
    

    function rightTurn(node) {
        const root = node.left;
        node.left = root.right;
        root.right = node;

        node.adjustH();
        root.adjustH();

        return root;
    }

    function leftTurn(node) {
        const root = node.right;
        node.right = root.left;
        root.left = node;

        node.adjustH();
        root.adjustH();

        return root;
    }

    function balance(node) {        
        node.adjustH();

        switch ( node.bfactor() ) {
            case 2:
                if (node.right.bfactor() < 0) {
                    node.right = rightTurn(node.right);
                }
                return leftTurn(node);
            case -2:
                if (node.left.bfactor() > 0) {
                    node.left = leftTurn(node.left);
                }
                return rightTurn(node);
            default:
                return node;
        }
    }

    function findNode(root, callbackFn) {
        if (root === null) {
            return null;
        }

        const searchFlag = callbackFn( root.getData() );

        if(searchFlag < 0) {
            return findNode(root.left, callbackFn);
        }

        if(searchFlag > 0) {
            return findNode(root.right, callbackFn);
        }

        return root;
    }   

    function removeMinHelper(root) {
        return function removeMin(node) {
            if(node.left === null) {                
                root.setData( node.getData() );

                return node.right;
            }

            node.left = removeMin(node.left);
            return balance(node);
        }
    }    

    function removeNode(root, callbackFn, success = {status: false}) {
        if(root === null) {
            return null;
        }

        const targetFlag = callbackFn( root.getData() );

        if(targetFlag < 0) {           
            root.left = removeNode(root.left, callbackFn, success);

        } else if(targetFlag > 0) {            
            root.right = removeNode(root.right, callbackFn, success);

        } else {            
            const {left, right} = root;
            success.status = true;

            if(left === null) {
                return right;
            }

            if(right === null) {
                return left;
            }
            
            root.right = removeMinHelper(root)(root.right);
        }

        return balance(root);
    }

    function functionsFactory(compareFn, Node) {
        function addNode(value, node) {
            if (node === null) {
                return new Node(value);
            }

            const compareResult = compareFn( value, node.getData() );

            if (compareResult > 0) {
                node.right = addNode(value, node.right);                
            } else if(compareResult < 0) {
                node.left = addNode(value, node.left);
            } else {
                return node.setData(value);
            }
            
            return balance(node);
        }

        function search(key, root) {
            if(root === null) {
                return null;
            }

            const searchFlag = compareFn( key, root.getData() );

            if(searchFlag > 0) {
                return search(key, root.right);
            }

            if(searchFlag < 0) {
                return search(key, root.left);
            }

            return root;
        }

        return {search, addNode};
    }    

    const AVLTreeUniqueKeys = ( function() {
        function AVLNode(value = null) {
            this.data = value;
            this.left = null;
            this.right = null;
            this.height = 1;
        }

        Object.assign(AVLNode.prototype, nodePrototype);
        Object.freeze(AVLNode.prototype); 

        const orderMethods = {
            preorder: function preOrder(node, callbackFn) {
                if(node !== null) {
                    callbackFn( node.getData() );
                    orderMethods.preorder(node.left, callbackFn);
                    orderMethods.preorder(node.right, callbackFn);
                } 
                return null;
            },
    
            inorder: function inOrder(node, callbackFn) {
                if ( node !== null ) {
                    inOrder(node.left, callbackFn);
                    callbackFn( node.getData() );
                    inOrder(node.right, callbackFn);
                }
                return null;
            },
    
            postorder: function postOrder(node, callbackFn) {
                if ( node !== null ) {
                    postOrder(node.left, callbackFn);
                    postOrder(node.right, callbackFn);
                    callbackFn( node.getData() );
                }
                return null;
            }
        };
        
        return class AVLTreeUniqueKeys {        
            #root = null;        
            insert;
            findByKey;
    
            constructor(compareFn) {
                if (typeof compareFn !== 'function') {
                    throw new TypeError('Argument must be a function.');
                }

                const {addNode, search} = functionsFactory(compareFn, AVLNode);
    
                this.insert = value => {
                    this.#root = addNode(value, this.#root);
                    return this;
                };

                this.findByKey = key => {
                    const result = search(key, this.#root);
                    return result === null ? result : result.getData();
                };
            }       
    
            traversal(callbackFn, order = 'inorder') {
                order = order.replace(/[^a-z]/gi, '').toLowerCase();
                
                orderMethods[order](this.#root, callbackFn);
                return this;
            }
    
            reduce(callbackFn, initialValue) {
                let cb;
                let acc;
    
                const initialCb = (acc, data) => {
                    cb = callbackFn;
                    return data;
                };
    
                if(arguments.length === 1) {
                    cb = initialCb;
                } else {
                    cb = callbackFn;
                    acc = initialValue;
                }            
    
                this.traversal(data => {                
                    acc = cb(acc, data);                
                });
    
                return acc;
            }
    
            find(compareFn) {
                const result = findNode(this.#root, compareFn);
                return result === null ? result : result.getData();
            }
            
            delete(compareFn) {
                const success = {status: false};
                this.#root = removeNode(this.#root, compareFn, success);
    
                return success.status;
            }
        }
    })();    

    const AVLTreeNonUniqueKeys = ( function () {
        function AVLNode(value = null) {
            this.left = null;
            this.right = null;
            this.height = 1;
            this.data = new DLList().push(value);
        }        

        Object.assign(AVLNode.prototype, nodePrototype, {
            setData(value) {
                this.data.push(value);
            },

            getData() {
                return this.data.getHeadValue();
            }
        });

        Object.freeze(AVLNode.prototype);    

        const orderMethods = {
            preorder: function preOrder(node, callbackFn) {
                if(node !== null) {                    
                    node.data.traversal(callbackFn);
                    orderMethods.preorder(node.left, callbackFn);
                    orderMethods.preorder(node.right, callbackFn);
                } 
                return null;
            },
    
            inorder: function inOrder(node, callbackFn) {
                if ( node !== null ) {
                    inOrder(node.left, callbackFn);
                    node.data.traversal(callbackFn);
                    inOrder(node.right, callbackFn);
                }
                return null;
            },
    
            postorder: function postOrder(node, callbackFn) {
                if ( node !== null ) {
                    postOrder(node.left, callbackFn);
                    postOrder(node.right, callbackFn);
                    node.data.traversal(callbackFn);
                }
                return null;
            }
        };
        return class AVLTreeNonUniqueKeys {
            #root = null;
            insert;
            findByKey;

            constructor(compareFn) {                
                if (typeof compareFn !== 'function') {
                    throw new TypeError('Argument must be a function.');
                }

                const {addNode, search} =  functionsFactory(compareFn, AVLNode);
    
                this.insert = function (value) {
                    this.#root = addNode(value, this.#root);
                    return this;
                };

                this.findByKey = key => {
                    const result = search(key, this.#root);
                    return result === null ? null : result.reduce((acc, data) => acc.push(data), new DLList() )
                };
            }

            traversal(callbackFn, order = 'inorder') {
                order = order.replace(/[^a-z]/gi, '').toLowerCase();
                
                orderMethods[order](this.#root, callbackFn);
                return this;
            }

            reduce(callbackFn, initialValue) {
                let cb;
                let acc;
    
                const initialCb = (acc, data) => {
                    cb = callbackFn;
                    return data;
                };
    
                if(arguments.length === 1) {
                    cb = initialCb;
                } else {
                    cb = callbackFn;
                    acc = initialValue;
                }            
    
                this.traversal(data => {                
                    acc = cb(acc, data);                
                });
    
                return acc;
            }

            find() {

            }

            delete() {

            }
        }
    })();
   
    return class AVLTreeBuilder {
        #compareFn;
        #Type;
        

        static #treeClasses = new Map([
            ['unique', AVLTreeNonUniqueKeys],
            ['non-unique', AVLTreeNonUniqueKeys]
        ]);

        static #defaultCompareFn(value, data) {
            if(value > data) {
                return 1;
            }    
            if(value < data) {
                return -1;
            }    
            return 0;
        }

        setCompareFn(fn = AVLTreeBuilder.#defaultCompareFn) {
            if(typeof fn !== 'function') {
                throw new TypeError('fn parameter must be a function');
            }
            this.#compareFn = fn;
            return this;
        }

        setTreeType(keysType = "unique") { 
            if( !AVLTreeBuilder.#treeClasses.has(keysType) ) {
                throw new Error(`keysType parameter can take the following values: ${[...AVLTreeBuilder.#treeClasses.keys()]}`);
            }

            this.#Type = AVLTreeBuilder.#treeClasses.get(keysType);
            return this;
        }

        create() {
            if(this.#Type === undefined || this.#compareFn === undefined) {
                throw new Error ('Compare function or tree type not specified');
            }

            return new this.#Type(this.#compareFn);
        }
    };
})();

export {    
    AVLTreeBuilder,
}


