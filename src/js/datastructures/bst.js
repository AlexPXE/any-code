import { DLList } from "./llist.js";


const classCreator = proto => {
    return constr => {
        Object.assign(constr.prototype, proto)
        
        return extendingObj => {            /*if object then extend prototype*/
            if(typeof extendingObj === 'object' && extendingObj !== null) {
               Object.assign(constr.prototype, extendingObj);
            }
            Object.freeze(constr.prototype);

            return constr;
        };
    };        
}

const AVLTreeClasses = classCreator => {
    const privateFields = new WeakMap();

    const createClass  = classCreator({

        insert(data) {
            const pFields = privateFields.get(this);            
            
            pFields.root = pFields.utils.addNode(data, pFields.root);
            return this;
        },
    
        traversal(callbackFn, order = 'inorder') {            
            const pFields = privateFields.get(this);

            order = order.replace(/[^a-z]/gi, '').toLowerCase();    

            pFields.utils[order](pFields.root, callbackFn);
            return this;
        },
    
        reduce(callbackFn, initialValue) {
            let cb;
            let acc;
    
            if(arguments.length === 1) {
                cb = (acc, data) => {
                    cb = callbackFn;
                    return data;
                };
            } else {
                cb = callbackFn;
                acc = initialValue;
            }            
    
            this.traversal(data => {                
                acc = cb(acc, data);                
            });
    
            return acc;
        },
    
        find(key, predicateFn = data => true) {            
            const pFields = privateFields.get(this);

            return pFields.utils.find(pFields.root, key, predicateFn);
        },
    
        delete(key, predicateFn = data => true) {
            const pFields = privateFields.get(this);
            const status = {success: false};        

            pFields.root = pFields.utils.removeNode(pFields.root, key, predicateFn, status);
            
            return status.success;
        },
    
        destroy() {
            privateFields.get(this).root = null;
            return this;
        }
    });


    return Object.freeze({
        UniqueKeys: createClass(
            function(utils) {
                privateFields.set(this, {utils, root: null});
            }
        )(null),

        NonUniqueKeys: createClass(
            function(utils) {
                privateFields.set(this, {utils, root: null});
            }
        )({
            filter(key, predicateFn) {//TODO: Implement filter
                throw new Error('Not implemented');
            }
        })
    });
};


const AVLTreeNodeClasses = classCreator => {

    const createClass = classCreator({
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
        },
    });
    
    return Object.freeze({

        UniqueKeys: createClass(
            function(data = null) {
                this.data = data;
                this.left = null;
                this.right = null;
                this.height = 1;
            }
        )(null),

        NonUniqueKeys: createClass(
            function (data = null) {
                this.data = new DLList().push(data);
                this.left = null;
                this.right = null;
                this.height = 1;
            }
        )({
            setData(data) {                
                this.data.push(data);                
                return this;
            },
            getData() {
                return this.data.getHeadValue();
            }
        }),
    });
};

const AVLTreeUtilsClasses = classCreator => {

    const createClass = classCreator({
        addNode(key, node) {                
            if (node === null) {                
                return new this.Node(key);
            }
            
            const compareResult = this.compareFn( key, node.getData());
    
            if (compareResult > 0) {
                node.right = this.addNode(key, node.right);                
            } else if(compareResult < 0) {
                node.left = this.addNode(key, node.left);
            } else {            
                return node.setData(key);
            }
            
            return this.balance(node);
        },
    
        balance(node) {
            node.adjustH();
    
            switch ( node.bfactor() ) {
                case  2:
                    if (node.right.bfactor() < 0) {
                        node.right = this.rightTurn(node.right);
                    }
                    return this.leftTurn(node);
                case -2:
                    if (node.left.bfactor() > 0) {
                        node.left = this.leftTurn(node.left);
                    }
                    return this.rightTurn(node);
                default:
                    return node;
            }
        },
    
        rightTurn(node) {
            const root = node.left;
            node.left = root.right;
            root.right = node;
    
            node.adjustH();
            root.adjustH();
    
            return root;
        },
    
        leftTurn(node) {
            const root = node.right;
            node.right = root.left;
            root.left = node;
    
            node.adjustH();
            root.adjustH();
    
            return root;
        },
    
        find(root, key, predicateFn) {
            if (root === null) {
                return null;
            }
    
            const searchFlag = this.compareFn(key, root.getData() );
    
            if(searchFlag < 0) {
                return this.find(root.left, key, predicateFn);
            }
    
            if(searchFlag > 0) {
                return this.find(root.right, key, predicateFn);
            }
    
            return predicateFn( root.getData() ) ? root.getData() : null;
        },   
    
        removeMinHelper(root) {
            const removeMin = node => {
                if(node.left === null) {                
                    root.setData( node.getData() );
    
                    return node.right;
                }
    
                node.left = removeMin(node.left);
                return this.balance(node);
            };
    
            return removeMin;
        },
    
        removeNode(root, key, predicateFn, status = {success: false}) {
            if(root === null) {
                return null;
            }
    
            const targetFlag = this.compareFn(key, root.getData() );
    
            if(targetFlag < 0) {
                root.left = this.removeNode(root.left, key, predicateFn, status);
    
            } else if(targetFlag > 0) {            
                root.right = this.removeNode(root.right, key, predicateFn, status);
    
            } else if( predicateFn( root.getData() ) ) {
                const {left, right} = root;
                status.success = true;
    
                if(left === null) {
                    return right;
                }
    
                if(right === null) {
                    return left;
                }
                
                root.right = this.removeMinHelper(root)(root.right);
            }
    
            return this.balance(root);
        },
    
        preorder(root, callbackFn) {
            if(root !== null) {
                callbackFn( root.getData() );
                this.preorder(root.left, callbackFn);
                this.preorder(root.right, callbackFn);
            } 
            return null;
        },
    
        inorder(root, callbackFn) {
            if ( root !== null ) {
                this.inorder(root.left, callbackFn);
                callbackFn( root.getData() );
                this.inorder(root.right, callbackFn);
            }
            return null; 
        },
    
        postorder(root, callbackFn) {
            if ( root !== null ) {
                this.postorder(root.left, callbackFn);
                this.postorder(root.right, callbackFn);
                callbackFn( root.getData() );
            }
            return null;
        },
    });

    return Object.freeze({
        UniqueKeys: createClass(
            function(Node, compareFn) {
                this.Node = Node;
                this.compareFn = compareFn;
            }
        )(null),

        NonUniqueKeys: createClass(
            function(Node, compareFn) {
                this.Node = Node;
                this.compareFn = compareFn;
            } 
        )({
            removeNode(root, key, predicateFn, status = {success: false}) {
                if(root === null) {
                    return null;
                }
        
                const targetFlag = this.compareFn(key, root.getData() );
        
                if(targetFlag < 0) {
                    root.left = this.removeNode(root.left, key, predicateFn, status);
        
                } else if(targetFlag > 0) {            
                    root.right = this.removeNode(root.right, key, predicateFn, status);
        
                } else {
                    status.success = root.data.delete(predicateFn);
    
                    if( root.data.getLength() === 0 ) {
                        const {left, right} = root;
        
                        if(left === null) {
                            return right;
                        }        
                        if(right === null) {
                            return left;
                        }
    
                        root.right = this.removeMinHelper(root)(root.right);
                        return this.balance(root);
                    }
                }    
                return root;
            },
    
            find(root, key, predicateFn) {
                if (root === null) {
                    return null;
                }
        
                const searchFlag = this.compareFn( key, root.getData() );
        
                if(searchFlag < 0) {
                    return this.find(root.left, key, predicateFn);
                }
        
                if(searchFlag > 0) {
                    return this.find(root.right, key, predicateFn);
                }
    
                return root.data.find(predicateFn);
            },   
            
            preorder(root, callbackFn) {
                if(root !== null) {
                    root.data.traversal(callbackFn);
                    this.preorder(root.left, callbackFn);
                    this.preorder(root.right, callbackFn);
                } 
                return null;
            },
    
            inorder(root, callbackFn) {
                if ( root !== null ) {
                    this.inorder(root.left, callbackFn);
                    root.data.traversal(callbackFn);
                    this.inorder(root.right, callbackFn);
                }
                return null;
            },
    
            postorder(root, callbackFn) {
                if ( root !== null ) {
                    this.postorder(root.left, callbackFn);
                    this.postorder(root.right, callbackFn);
                    root.data.traversal(callbackFn);
                }
                return null;
            }
        }),
    });
};

/**
 * 
 * @param {Object} trees 
 * @param {Object} utils 
 * @param {Object} nodes 
 * @returns {Object}
 */
function TreeFactoryCreator(trees, utils, nodes) {

    return Object.freeze(
        Object.entries(trees).reduce((acc, [key, Tree]) => {        
            acc[key] = function(compareFn) {
                const utilsInstance = new utils[key](nodes[key], compareFn);
    
                return function() {
                    return new Tree(utilsInstance);
                }
            }
    
            return acc;
        }, {})
    );
}

/**
 * @type {AVLTreeFactory}
 */
const AVLTree = TreeFactoryCreator(
    AVLTreeClasses(classCreator),
    AVLTreeUtilsClasses(classCreator),
    AVLTreeNodeClasses(classCreator)
);

/**
 * @typedef {Object} AVLTreeFactory
 * @property {Function} NonUniqueKeys Create AVL Tree with non-unique keys.
 * @property {Function} UniqueKeys Create AVL Tree with unique keys.
*/


export {    
    AVLTree
}



