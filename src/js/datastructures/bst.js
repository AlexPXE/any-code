import { DLList } from "./llist.js";

//Default AVLTree class
class AVLTree {
    #root = null;    
    #utils;
    

    constructor(utils) {
        this.#utils = utils;        
    }

    insert(data) {
        this.#root = this.#utils.addNode(data, this.#root);
        return this;
    }

    traversal(callbackFn, order = 'inorder') {
        order = order.replace(/[^a-z]/gi, '').toLowerCase();

        this.#utils[order](this.#root, callbackFn);
        return this;
    }

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
    }

    find(key, predicateFn = data => true) {
        return this.#utils.find(this.#root, key, predicateFn);
    }

    delete(key, predicateFn = data => true) {
        const status = {success: false};        
        this.#root = this.#utils.removeNode(this.#root, key, predicateFn, status);
        
        return status.success;
    }

    destroy() {
        this.#root = null;
        return this;
    }
}

//Factory Builder
class TreeFactoryBuilder {
    #Utils = null;
    #Node = null;
    #TreeClass = null;

    addTreeClass(TreeClass) {
        this.#TreeClass = TreeClass;
        return this;
    }

    AddNodeClass(NodeClass) {
        this.#Node = NodeClass;
        return this;
    }

    addUtilsClass(UtilsClass) {
        this.#Utils = UtilsClass;
        return this;
    }

    create() {
        const BaseClass = this.#TreeClass;
        const Utils = this.#Utils;
        const Node = this.#Node;

        this.#TreeClass = null;
        this.#Utils = null;
        this.#Node = null;

        return class {
            #utils;

            constructor(fn) {
                this.#utils = new Utils(Node, fn)
            }
            create() {
               return new BaseClass(this.#utils);
            }
        }
    }
}

const classFactory = proto => {
    return constr => {
        Object.assign(constr.prototype, proto)
        
        return extendingObj => {            /*if object then extend prototype*/
            if(typeof extendingObj === 'object' && extendingObj !== null) {
               Object.assign(constr.prototype, extendingObj, {
                    super: proto,
               });
            }
            Object.freeze(constr.prototype);

            return constr;
        };
    };        
}

const AVLTreeBuilder = new TreeFactoryBuilder();

//set default prototype for the Node Class
const createAVLTreeNodeClass = classFactory({
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

    super: null
});

//set default prototype for the Utils class
const createAVLTreeUtilsClass = classFactory({
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

//AVL Tree with support for unique keys only 
const AVLTreeUK = AVLTreeBuilder
    .addTreeClass(AVLTree)
    .AddNodeClass(
        createAVLTreeNodeClass(
            function(data = null) {
                this.data = data;
                this.left = null;
                this.right = null;
                this.height = 1;
            }
        )(null)
    )
    .addUtilsClass(
        createAVLTreeUtilsClass(
            function(Node, compareFn) {
                this.Node = Node;
                this.compareFn = compareFn;
            }
        )(null)
    )
    .create();

//AVL Tree with support for non-unique keys
const AVLTreeNonUK = AVLTreeBuilder
    .addTreeClass(AVLTree)
    .AddNodeClass(
        createAVLTreeNodeClass(
            function (data = null) {
                this.data = new DLList().push(data);
                this.left = null;
                this.right = null;
                this.height = 1;
            }
        )({
            setData(data) {                
                this.data.push(data);
                console.log(data , this.data.getLength());
                return this;
            },
            getData() {
                return this.data.getHeadValue();
            }
        })
    )
    .addUtilsClass(
        createAVLTreeUtilsClass(
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
        })
    )
    .create();

export {    
    AVLTreeNonUK,
    AVLTreeUK
}


