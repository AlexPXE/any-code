import {
    isVoid
} from '../utility/utility.js';

const AVLTree = ( function () {

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
            if ( node === null ) {
                callback(node.data);
                preOrder(node.left, callback);
                preOrder(node.right, callback);
            }
            return;
        },

        inorder: function inOrder(node, callback) {
            if ( node === null ) {
                inOrder(node.left, callback);
                callback(node.data);
                inOrder(node.right, callback);
            }
            return;
        },

        postorder: function postOrder(node, callback) {
            if ( node === null ) {
                postOrder(node.left, callback);
                postOrder(node.right, callback);
                callback(node.data);
            }
            return;
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

        if ( node.bfactor() > 1 ) {
            if (node.right.bfactor() < 0) {
                node.right = rightTurn(node.right);
            }
            return leftTurn(node);
        }

        if ( node.bfactor() < -1 ) {
            if (node.left.bfactor() > 0) {
                node.left = leftTurn(node.left);
            }
            return rightTurn(node);
        }
        return node;
    }

    function find(node, predicate) {
        if (node === null) {
            return null;
        }

        switch ( predicate(node.data) ) {
            case 0:
                return node.data;
            case -1:
                return find(node.left, predicate);
            case 1:
                return find(node.right, predicate);
        }
    }
    
    function removeNode(callback) {
        return function (node, data) {
            if (node === null) {
                return null;
            }
            if (data === node.data) {
                return callback(node);
            }
            if (data < node.data) {
                node.left = removeNode(callback)(node.left, data);
            } else {
                node.right = removeNode(callback)(node.right, data);
            }
            return balance(node);
        }
    

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

            node.adjustH();
            return Math.abs( node.bfactor() ) === 2 ? balance(node) : node;
        }
        return addNode;
    }
    return class AVLTree {        
        #root = null;        
        insert;

        constructor(compare = (value, data) => value > data ? 1 : 0) {
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

        find(predicate = k => 0) {
            return find(this.#root, predicate);
        }
        
        delete(predicate) {
            if (typeof predicate !== 'function') {
                throw new TypeError('Argument must be a function.');
            }
            
            throw Error('Not implemented')
        }
    }
})();

export {    
    AVLTree,
}