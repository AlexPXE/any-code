
const AVLTree = ( function() {

    const TestNode = ( function () {
        function AVLNode(value = null) {
            this.data = value;
            this.left = null;
            this.right = null;
            this.height = 1;
        }        

        AVLNode.prototype.rHeight = function () {
            if(this.right === null) {
                return 0;
            }

            return this.right.height;
        }

        AVLNode.prototype.lHeight = function () {
            if(this.left === null) {
                return 0;
            }

            return this.left.height;
        }

        AVLNode.prototype.bfactor = function () {
            return ( this.rHeight() - this.lHeight() );
        }

        AVLNode.prototype.adjustH = function () {
            return this.height = Math.max( this.rHeight(), this.lHeight() ) + 1;
        }

        Object.freeze(AVLNode.prototype);        
        return AVLNode;
    })();    

    const orderMethods = {
        preorder: function preOrder(node, callback) {

            if(node !== null) {
                callback(node.data);
                orderMethods.preorder(node.left, callback);
                orderMethods.preorder(node.right, callback);
            }           
            
            return null;
        },

        inorder: function inOrder(node, callback) {
            if ( node !== null ) {
                inOrder(node.left, callback);
                callback(node.data);
                inOrder(node.right, callback);
            }
            return null;
        },

        postorder: function postOrder(node, callback) {
            if ( node !== null ) {
                postOrder(node.left, callback);
                postOrder(node.right, callback);
                callback(node.data);
            }
            return null;
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

        switch (node.bfactor()) {
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

    function findNode(root, predicate) {
        if (root === null) {
            return null;
        }

        switch ( predicate(root.data) ) {
            case 0:
                return root;
            case -1:
                return findNode(root.left, predicate);
            case 1:
                return findNode(root.right, predicate);
        }
    }

    function findMin(root) {        
        return root.left === null ? root : findMin(root.left);
    }

    function removeMinHelper(root) {
        return function removeMin(node) {
            if(node.left === null) {                
                root.data = node.data;

                return node.right;
            }

            node.left = removeMin(node.left);
            return balance(node);
        }
    }    

    function removeNode(root, callback, success = {status: false}) {
        if(root === null) {
            return null;
        }

        const targetFlag = callback(root.data);

        if(targetFlag < 0) {           
            root.left = removeNode(root.left, callback, success);

        } else if(targetFlag > 0) {            
            root.right = removeNode(root.right, callback, success);

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
    
    function addNodeFactory(compare) {
        
        function addNode(value, node) {
            if (node === null) {
                return new TestNode(value);
            }

            if ( compare(value, node.data) > 0 ) {
                node.right = addNode(value, node.right);
                
            } else {
                node.left = addNode(value, node.left);
            }
            
            return balance( node );
        }
        return addNode;
    }
    return class AVLTree {        
        #root = null;        
        insert;

        constructor(compare = (value, data) => value > data ? 1 : -1) {
            if (typeof compare !== 'function') {
                throw new TypeError('Argument must be a function.');
            }

            this.insert = (() => {
                const addNode = addNodeFactory(compare);

                return function (value) {
                    this.#root = addNode(value, this.#root);
                    return this;
                }
            })();
        }       

        traversal(callback, order = 'inorder') {
            order = order.replace(/[^a-z]/gi, '').toLowerCase();

            orderMethods[order](this.#root, callback);
            return this;
        }

        reduce(callback, initialValue) {
            let cb;
            let acc;

            const initialCb = (acc, data) => {
                cb = callback;
                return data;
            };

            if(arguments.length === 1) {
                cb = initialCb;
            } else {
                cb = callback;
                acc = initialValue;
            }            

            this.traversal(data => {                
                acc = cb(acc, data);                
            });

            return acc;
        }

        find(predicate) {
            const result = findNode(this.#root, predicate);
            return result === null ? result : result.data;
        }
        
        delete(predicate) {
            const success = {status: false};
            this.#root = removeNode(this.#root, predicate, success);

            return success.status;
        }
    }
})();


export {    
    AVLTree,
}


