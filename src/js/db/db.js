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
    #columns;
    #table = [];
    #lastId = 0;
    constructor(...columns) {
        super();

        columns.forEach(name => {
            if(!name || typeof name !== 'string') {
                throw new Error('Column name must be a string.');
            }
        });

        this.#columns = new Set(columns).add('id');
    }    

    static stringify(table) {

        if(!(table instanceof this)) {
            throw new Error('Invalid table.');
        }
        
        return JSON.stringify({
            columns: [...table.#columns],
            table: table.#table,
            lastId: table.#lastId
        });
    }

    static parse(str) {
        const {columns, table, lastId} = JSON.parse(str);
        const tableInst = new DbTable(...columns);

        table.#table = table;
        table.#lastId = lastId;
        
        return tableInst;
    }
    
    getColumns() {
        return [...this.#columns];
    }

    getElement(id) {
        
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

