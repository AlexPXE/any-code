"use strict";

import { random, fastPow, modExp, modExpRecur, gcd, eulert } from '../math/math.js';


const alphabet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
    'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 
    'щ', 'ь', 'ы', 'ъ', 'э', 'ю', 'я','А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 
    'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ь', 'Ы', 'Ъ', 'Э', 'Ю', 'Я','=', '+', '-', '*', '/', '%', '^', '&', '|', '!', '?', '<', '>', '.', 
    ',', ':', ';', '"', '\'', '\\', '{', '}', '[', ']', '(', ')', ' ', '\n', '\t', '\r', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];


let any = 25 * 31;

console.log(eulert(any), eulert(25), eulert(31));







function fermaTest(n) {
    
}


const Crypto = (function() {

    function random(max, min = 0) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    

    function* generateSequence(alphabet, max = 7, min = 2) {

        let seqLength = random(max, min);
        const alphLength = alphabet.length - 1;

        while(seqLength > 0) {
            yield alphabet[ random(alphLength, min) ];
            seqLength--;
        }       
        
    }

    return class Crypto {
        constructor(alphabet) {
    
            const dict = new Map();   
            const length = alphabet.length;

            alphabet.forEach( (char, index) => {
                dict.set(char, randomSubseq(alphabet));
            });
        }


        encrypt(filename, password) {
    
        }
    
        
    
        uncrypt(filename, password) {
    
        }
        
    }
    
})();


