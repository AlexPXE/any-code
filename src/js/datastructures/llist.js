class Llist {
    constructor(...args) {
        let head = null;
        let tail = null;
        this.cash = new WeakMap();

        this.length = 0;

        this.setHead = (node) => {            
            if( node === null || (node instanceof Node) ) {
                head = node;
                return head;    
            }   

            throw new Error('Node is null');   
        };

        this.setTail = node => {
            if( node !== null || !(node instanceof Node) ) {
                throw new Error('Not a node');                    
            }
            
            tail = node;
            return tail;
        };

        this.getHead = () => {
            return head;
        };

        this.getTail = () => {
            return tail;
        };               

        if(args.length > 0) {
            this.push(...args);
        }       
    }

    *[Symbol.iterator]() {
        let node = this.getHead();
        while(node !== null) {
            yield node.value;
            node = node.next;
        }        
    }

    swap(){

    }

    delete(){

    }

    shift() {

        if(this.length == 0) {
            return null;
        } else {                  
            let head = this.getHead();            
            const {next} = head;
            
            if(next) {                                                
                next.prev = null;                
                this.setHead(next);
            } else {                                
                this.setTail(null);
                this.setHead(null);                
            }
            
            this.length--;
            return head.value;
        }   
    }

    unshift(...args) {

        if (args.length == 0) {
            throw new Error('No arguments');
        }

        args.forEach((arg) => {            
            let head = this.getHead();

            const node = new Node(arg);

            if (!head) {
                this.setHead(node);
                this.setTail(node);
            } else {
                node.next = head;
                head.prev = node;
                this.setHead(node);
            }           

            ++this.length;
        });


        return this.length;
    }

    push(...args) {

        if (args.length == 0) {
            throw new Error('No arguments');
        }       

        args.forEach(arg => {     

            let tail = this.getTail();      
            const node = new Node(arg);
            
            if (tail) {
                tail.next = node;
                node.prev = tail;
                this.setTail(node);                
            } else {
                this.setHead(node);
                this.setTail(node);
            }
            
            this.cash

            ++this.length;
        });        
        
        return this.length;
    }

    pop() {

        if(this.length == 0) {
            return null;
        }

        const tail = this.getTail();
        const {prev} = tail;

        if(prev) {
            prev.next = null;
            this.setTail(prev);
        } else {
            this.setHead(null);
            this.setTail(null);
        }

        this.length--;
        return tail.value;
    }

    showList() {
        let temp = this.getHead();
        let arr = [];

        while(temp) {
            arr.push(temp.value);
            temp = temp.next;
        }

        return arr;
    }

    showListRev() {
        let temp = this.getTail();
        let arr = [];

        while(temp) {
            arr.push(temp.value);
            temp = temp.prev;
        }

        return arr;
    }    
}


export {Llist};