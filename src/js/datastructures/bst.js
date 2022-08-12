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

class AVLTree {
    #root = null;
    #compare;

    constructor(compare = (a, b) => a > b ? 1 : 0) {
        if(typeof compare === 'function') {
            const right = 'right';
            const left = 'left'
            
            this.#compare = (a, b) => compare(a, b) > 0 ? right : left;            
        }

        throw new TypeError('Argument must be a function.');
    }
    
    #addNode(root, key) {
        if(root === null) {
            return new AVLNode(key);
        }

        const child = this.#compare(key, root.key); //if key > root.key then 'right' else 'left'
        root[child] = this.#addNode(root[child], key);

        root.adjustH();
        return this.balance(root);
    }

    insert(key) {
        this.#root = this.#addNode(this.#root, key);
        return this;
    }

    balance(node = this.#root) {
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

    show(root = this.#root) {
        if(root === null) {
            return;
        }

        this.show(root.left);
        console.log(root.key);
        this.show(root.right);
        
        return;
    }  

    search(key, root = this.#root) {
        if(root === null) {
            return null;
        }


    }
}

const tree = new AVLTree();
const arr = [];


for(let i = 0, j; i < 10; i++) {
    j = Math.floor(Math.random() * 100);
    tree.insert(j);
    arr.push(j);
}

console.log('=======');
tree.show();

export {
    AVLTree
}