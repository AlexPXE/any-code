import {
    isVoid
} from '../utility/utility.js';

const AVLTree = ( function () {

    const TestNode = ( function () {
        function AVLNode(value) {
            this.key = value;
            this.left = null;
            this.right = null;
            this.height = 1;
        }

        AVLNode.prototype.lHeight = function () {
            if(this.left === null) {
                return 0;
            }
            
            return this.left.height;
        }

        AVLNode.prototype.rHeight = function () {
            if(this.right === null) {
                return 0;
            }
            
            return this.right.height;
        }

        AVLNode.prototype.bfactor = function () {
            return (this.rHeight() - this.lHeight());
        }

        AVLNode.prototype.adjustH = function () {
            return this.height = Math.max(this.rHeight(), this.lHeight()) + 1;
        }

        return AVLNode;
    })();

    const orderMethods = {
        preorder: function preOrder(node, callback) {
            if (!isVoid(node)) {
                callback(node.key);
                preOrder(node.left, callback);
                preOrder(node.right, callback);
            }

            return;
        },

        inorder: function inOrder(node, callback) {
            if (!isVoid(node)) {
                inOrder(node.left, callback);
                callback(node.key);
                inOrder(node.right, callback);
            }

            return;
        },

        postorder: function postOrder(node, callback) {
            if (!isVoid(node)) {
                postOrder(node.left, callback);
                postOrder(node.right, callback);
                callback(node.key);
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

        if (node.bfactor() > 1) {
            if (node.right.bfactor() < 0) {
                node.right = rightTurn(node.right);
            }

            return leftTurn(node);
        }

        if (node.bfactor() < -1) {
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

        switch (predicate(node.key)) {
            case 0:
                return node.key;
            case -1:
                return find(node.left, predicate);
            case 1:
                return find(node.right, predicate);
        }
    }

    function addNodeFactory(compare) {

        function addNode(node, key) {
            if (node === null) {
                return new TestNode(key);
            }

            if (compare(key, node.key) > 0) {
                node.right = addNode(node.right, key);
            } else {
                node.left = addNode(node.left, key);
            }            

            node.adjustH();

            return Math.abs(node.bfactor()) === 2 ? balance(node) : node;
        }

        return addNode;

    }
    return class AVLTree {        
        #root = null;
        insert;

        constructor(compare = (a, b) => a > b ? 1 : 0) {
            if (typeof compare !== 'function') {
                throw new TypeError('Argument must be a function.');
            }

            this.insert = (() => {
                const addNode = addNodeFactory(compare);

                return function (key) {
                    this.#root = addNode(this.#root, key);
                    return this;
                }
            })();
        }

        traversal(callback, order = 'inorder') {
            order = order.replace(/[^a-z]/gi, '').toLowerCase();

            orderMethods[order](this.#root, callback);
            return this;
        }

        findByKey(predicate = k => 0) {
            return find(this.#root, predicate);
        }
    }
})();

export {
    AVLTree,
}