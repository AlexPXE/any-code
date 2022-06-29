"use strict";
//TODO: Add a description of the module


import path from 'path';
import { fileURLToPath } from 'url';
import os, { type } from 'os';
import EventEmitter from 'events';
import http from 'http';
import fs from 'fs/promises';



/* 
async function readFile(path) {
    const data =  await sykaBlad.appendFile(path, '\nЙа записаль в филе!!! dfdfdf', 'utf8');
    console.log(data);
    return data;
}

    readFile(path.join('D:', 'sccr.txt')).then;
*/



import { 
    CommonFractionBig,   
    eulerst,     
    fastPowBig,          
    fermaTestBigR, 
    fermaTestBig,
    gcdExBig,
    gcd, 
    lcm,
    lcmBig,
    modExpBig, 
    modExpBigR,
    randomBig, 
    random, 
    randomBits,
    randomPrime
} from '../math/math.js';

const PRIME_NUMBERS_MIN_BIT_SIZE = 8;
const OPEN_EXPONENT_BIT_SIZE = 16;

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const alphabet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
    'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 
    'щ', 'ь', 'ы', 'ъ', 'э', 'ю', 'я','А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 
    'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ь', 'Ы', 'Ъ', 'Э', 'Ю', 'Я','=', '+', '-', '*', '/', '%', '^', '&', '|', '!', '?', '<', '>', '.', 
    ',', ':', ';', '"', '\'', '\\', '{', '}', '[', ']', '(', ')', ' ', '\n', '\t', '\r', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];



class ExtMap extends Map {

    constructor(entries) {
        super();        
        
        entries && this.fromEntries(entries);        
    }

    set(key, value = null) {        

        if(!this.has(key)) {

            if(typeof key === 'object') {
                throw new Error('Key can not be an object');
            }    

            Object.defineProperties(this, {
                [key]: {
                    
                    set(value) {                        
                        this.setData(key, value);
                    },
    
                    get() {
                        return this.getData(key);
                    }
                }            
            });    
        }
        
        this[key] = value;

        return this;
    }

    stringify() {
        return JSON.stringify( Object.fromEntries(this.entries()),
        (k, v) => {
            if(typeof v === 'bigint') {
                return v.toString() + 'TBigint';
            }
            return v;
        }, 2 );
    }

    parse(str) {
        const tmp = JSON.parse(str, (k, v) => {            

            if(k === '' || !v.endsWith('TBigint')){
                return v;
            }

            return BigInt(v.slice(0, -7));
        });

        const type = tmp.constructor;

        try{
            if(type === Object) {
                this.fromEntries(Object.entries(tmp));
    
            } else if(type === Array) {
                this.fromEntries(tmp);

            } else {
                throw new TypeError(`Can not parse string: ${tmp}`);        
            }
        } catch(e) {
            throw new TypeError(e.message);
        }

        return this;
    }
    

    fromEntries(entries) {
        entries.forEach( ([key, value]) => this.set(key, value) );
        return this
    }

    toString() {
        return 'Extended Map: ' + this.stringify();
    }

    setData(key, value) {
        super.set(key, value);
        return this;
    }

    getData(key) {
        return super.get(key);
    }

    delete(...key) {
        key.forEach( key => {
            super.delete(key) ? delete this[key] : null;
        } );
        return this;
    }

    clear() {
        super.clear();
        Object.keys(this).forEach( key => delete this[key] );
        return this;
    }
}

class ExtMapMod extends ExtMap {   

    constructor(entries) {
        super();

        entries && this.fromEntries(entries);
    }

    set(key, value, type) {
        if(!this.has(key)) {

            if(typeof key === 'object') {
                throw new Error('Key can not be an object');
            }            

            Object.defineProperties(this, {
                [key]:{
                    
                    set(value) {
                        if(typeof value !== type) {
                            throw new Error('Value must be ' + type);
                        }

                        this.setData(key, value);
                    },
    
                    get() {
                        return this.getData(key);
                    }
                }            
            });    
        }

        this[key] = value;

        return this;
    }

    fromEntries(entries) {
        entries.forEach( ([key, value]) => this.set(key, value, typeof value) );
        return this
    }
}



class KeysGeneratorInterface {
    constructor() {
        if(this.constructor === KeysGeneratorInterface) {
            throw new Error(`Cannot construct KeysGeneratorInterface instances directly!`);
        }        
    }

    get size() {
        throw new Error(`Not implemented!`);
    }

    set size(size) {
        throw new Error(`Not implemented!`);
    }

    generate() {
        throw new Error(`Not implemented!`);
    }
}

class KeysGenerator extends KeysGeneratorInterface {
    
    #size;
    constructor(size = PRIME_NUMBERS_MIN_BIT_SIZE) {
        super();

        this.size = size;
    }   

    get size() {
        return this.#size;
    }
    
    set size(size) {
        if(size < PRIME_NUMBERS_MIN_BIT_SIZE) {
            this.#size = PRIME_NUMBERS_MIN_BIT_SIZE;
        } else {
            this.#size = size;
        }        
        
    }

    generate(description = '') {
        const primePair = new Set();
        while(primePair.size < 2) {
            primePair.add( randomPrime(this.#size) );        
        }
        
        const [p1, p2] = primePair.values();        
        const phi = (p1 - 1n) * (p2 - 1n); 
        const phiSize = phi.toString(2).length;
        
        let e;

         do {
            e = randomPrime(phiSize > OPEN_EXPONENT_BIT_SIZE ? 
                OPEN_EXPONENT_BIT_SIZE : 
                OPEN_EXPONENT_BIT_SIZE - 1
            );
        } while (phi % e === 0n)           

        const tmp = gcdExBig(phi, e)[1];       
        
        const keys = new ExtMapMod([
            ['description', description],
            ['module', p1*p1],
            ['publicExp', e],
            ['privateExp', tmp < 0n ? tmp + phi : tmp],

        ]);        
        return keys;
    }
}


const key128 = new KeysGenerator(128);
const jsonString = key128.generate('test').stringify();

console.log(jsonString === new ExtMapMod().parse(jsonString).stringify());

















