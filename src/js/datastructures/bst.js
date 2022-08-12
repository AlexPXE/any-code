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

    get leftH() {        
        return 0 + this.left;
    }

    get rightH () {
        return 0 + this.right;
    }

    get bfactor() {
        return this.right - this.left;
    }

    adjustH() {        
        return this.height = Math.max(this.right, this.left) + 1;
    }    
}

class AVLTree {
    #root = null;
    #compare;

    constuctor(compare = (a, b) => a > b ? 1 : 0) {        
        this.setCompare(compare);
    }
    
    #addNode(root, key) {
        if(root === null) {
            return new AVLNode(key);
        }

        const child = this.#compare(key, root.key); //'right' or 'left'
        root[child] = this.#addNode(root[child], key);

        root.adjustH();
        return this.balance(root);
    }

    insert(key) {
        this.root = this.#addNode(this.root, key);
    }

    balance(node = this.root) {
        if(node.bfactor  === 2) {
            
            if(node.right.bfactor < 0 ) {
                node.right = this.rightTurn(node.right);
            }
            
            return this.leftTurn(node);
        }

        if(node.bfactor === -2) {

            if(node.left.bfactor > 0) {
                node.left = this.leftTurn(node.left);
            }
            
            return this.rightTurn(node);
        }

        return node;
    }

    rightTurn(node) {
        const root = node.left;
        node.left = root.right;
        root.right = node;

        node.adjustH();
        root.adjustH();

        return root;
    }

    leftTurn(node) {
        const root = node.right;
        node.right = root.left;
        root.left = node;

        node.adjustH();
        root.adjustH();

        return root;
    }

    setCompare(callback) {
        if(typeof callback === 'function') {
            const right = 'right';
            const left = 'left'

            this.#compare = (a, b) => callback(a, b) > 0 ? right : left;
            return this;
        }

        throw new TypeError('Argument must be a function.');
    }
}

export {
    AVLTree
}