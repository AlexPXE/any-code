'use strict';


class DbTableInterface {
    constructor() {
        if(this.constructor === DbTableInterface) {
            throw new Error('DbTableInterface cannot be instantiated directly.');
        }
    }   

    getColumns() {
        throw new Error('Not implemented.'); //[x]
    }

    getElement() {
        throw new Error('Not implemented.'); //[ ]
    }
    
    select() {
        throw new Error('Not implemented.'); //[ ]
    }

    addElement() {
        throw new Error('Not implemented.'); //[ ]
    }

    updateElement() {
        throw new Error('Not implemented.'); //[ ]
    }

    sortByColumn() {
        throw new Error('Not implemented.'); //[ ]
    }
}


class DbTable extends DbTableInterface {
    
    #columns = new Map();    
    #table = new Map();
    #recycleBin = new Set();
    #freeID = new Set();    
    #lastId = 0;
    
    #rowFactory;

    constructor(columns) { 
        super();        

        this.#columns = new Map( Object.entries(columns) ).set('id', 'number');
    }

    #validateValue(cName, value) {
        return this.#columns.get(cName) === value?.constructor?.name;
    }
    
    

    #chekPropType(prop, value) {
        if(!(typeof value !== this.#columns.get(prop))) {
            throw new TypeError('Invalid type.');
        }        
        return value;
    }
    
    getColumns() {
        return [...this.#columns];
    }

    getElement(id) {
        
    }

    addElement(...values) {
        const row = Object.create(null);

        this.#columns.forEach((type, prop) => {
            row[prop] = this.#chekPropType(prop, values[prop]);
        });

    }

    [Symbol.toPrimitive]() {
        return '[object DbTable]';
    }

    toString() {
        return '' + this;
    }
}




class DbInterface {
    constructor() {
        if(this.constructor === DbInterface) {
            throw new TypeError('"DbInterface" cannot be instantiated directly.');
        }        
    }

    addTable() {
        throw new Error('Not implemented.');
    }

    createTable() {
        throw new Error('Not implemented.');
    }

    select() {
        throw new Error('Not implemented.');
    }

    deleteTable() {
        throw new Error('Not implemented.');
    }

    save() {
        throw new Error('Not implemented.');
    }

    saveAs() {
        throw new Error('Not implemented.');
    }

    load() {
        throw new Error('Not implemented.');
    }        
}


 
