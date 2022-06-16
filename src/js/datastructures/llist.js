class Node {
    constructor(data) {
        this.value = data;
        this.next = null;
        this.prev = null;
    }
}
class Llist {
    constructor(...args) {
        let head = null;
        let tail = null;
        this.length = 0;
        
        Object.defineProperties(this, {
            head: {
                get: () => head,

                set: node => {
                    if( node === null || (node instanceof Node) ) {
                        head = node;                        
                    } else {
                        throw new Error('Invalid node');
                    }   
                }                
            },

            tail: {
                get: () => tail,

                set: node => {                    
                    if( node === null || (node instanceof Node) ) {
                        tail = node;                        
                    } else {
                        throw new Error('Invalid node');                                           
                    }
                    
                }
            },               
        });
        

        if(args.length > 0) {
            this.push(...args);
        }       
    }

    *[Symbol.iterator]() {
        let node = this.head;
        while(node !== null) {
            yield node.value;
            node = node.next;
        }
    }

    swap() {
        throw new Error('Not implemented');
    }

    delete() {
        throw new Error('Not implemented');
    }

    shift() {

        if(this.length == 0) {
            return null;
        } else {                  
            let {head} = this;
            const {next} = head;
            
            if(next) {                                                
                next.prev = null;                
                this.head = next;
            } else {                                
                this.tail = null;
                this.head = null;                
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
            let {head} = this;

            const node = new Node(arg);

            if (!head) {
                this.head = node;
                this.tail = node;
            } else {
                node.next = head;
                head.prev = node;
                this.head = node;
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

            let {tail} = this;
            const node = new Node(arg);
            //console.log('push', arg);
            
            if (tail) {
                tail.next = node;
                node.prev = tail;
                this.tail = node;                
            } else {
                this.head = node;
                this.tail = node;
            }          

            ++this.length;
        });        
        
        return this.length;
    }

    pop() {

        if(this.length == 0) {
            return null;
        }

        const tail = this.tail;
        const {prev} = tail;

        if(prev) {
            prev.next = null;
            this.tail = prev;
        } else {
            this.head = null;
            this.tail = null;
        }

        //console.log('pop', tail.value);
        this.length--;
        return tail.value;
    }

    showList() {
        let {head:temp} = this;
        let arr = [];

        while(temp) {
            arr.push(temp.value);
            temp = temp.next;
        }

        return arr;
    }

    showListRev() {
        let {tail:temp} = this;
        let arr = [];

        while(temp) {
            arr.push(temp.value);
            temp = temp.prev;
        }

        return arr;
    }    
}

export {Llist};