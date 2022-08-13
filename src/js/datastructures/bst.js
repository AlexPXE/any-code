

const AVLTree = (function(){    
    class AVLNode {
        key;
        left = null;
        right = null;
        height = 1;
    
        constructor(value = null) {
            this.key = value;
        }
    
        [Symbol.toPrimitive](hint) {
            return this.height;
        }        
    
        get bfactor() {
            return this.right - this.left;
        }
    
        adjustH() {
            return this.height = Math.max(this.right, this.left) + 1;
        }
    }

    const orderMethods = {
        preorder: function preOrder(node, callback) {
            if (node) {
                callback(node.key);
                preOrder(node.left, callback);
                preOrder(node.right, callback);
            }

            return;
        },

        inorder: function inOrder (node, callback) {
            if (node) {
                inOrder(node.left, callback);
                callback(node.key);
                inOrder(node.right, callback);
            }

            return;
        },

        postorder: function postOrder (node, callback) {
            if (node) {
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
        if(node.bfactor  === 2) {
            
            if(node.right.bfactor < 0 ) {
                node.right = rightTurn(node.right);
            }
            
            return leftTurn(node);
        }

        if(node.bfactor === -2) {

            if(node.left.bfactor > 0) {
                node.left = leftTurn(node.left);
            }

            return rightTurn(node);
        }

        return node;
    }

    function find(node, predicate) {
        if(node === null) {
            return null;
        }

        switch(predicate(node.key)) {
            case 0:
                return node.key ;
            case -1:
                return find(node.left, predicate);
            case 1:
                return find(node.right, predicate);            
        }
    }
    

    function addNodeFactory(compare) {

        const right = 'right';
        const left = 'left';

        const callback = (a, b) => compare(a, b) > 0 ? right : left;
        
        function addNode(node, key) {
            if(node === null) {
                return new AVLNode(key);
            }
    
            const child = callback(key, node.key); //if key > root.key then 'right' else 'left'
            node[child] = addNode(node[child], key);
    
            node.adjustH();
            return balance(node);    
        }

        return addNode;
        
    }


    return class AVLTree {              
        #root = null;
        insert;

        constructor(compare = (a, b) => a > b ? 1 : 0) {
            if(typeof compare !== 'function') {
                throw new TypeError('Argument must be a function.');    
            }

            this.insert = (() => {
                const addNode = addNodeFactory(compare);

                return function(key) {
                    this.#root = addNode(this.#root, key);
                    return this;
                }
            })();
        }        

        traversal(callback, order ='inorder') {
            order = order.replace(/[^a-z]/gi, '').toLowerCase();

            orderMethods[order](this.#root, callback);
            return this;
        }

        findByKey(predicate = k => 0) {
            return find(this.#root, predicate);
        }
    }
})();



const tree = new AVLTree();
const arr = [];

for(let i = 0, j; i < 10; i++) {
    j = Math.floor(Math.random() * 100);
    tree.insert(j);
    arr.push(j);
}


tree.traversal(console.log);

console.log(tree.findByKey(k => {
    if(k === 53) {
        return 0;
    }
    
    return k > 50 ? 1 : -1;
}));


export {
    AVLTree
}