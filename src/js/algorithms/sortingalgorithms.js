"use strict"
function foo(){
    let i = 0;
    return new Promise( (resolve, reject) => {
        i++;
        resolve();
    });
}

foo().then( () => console.log('Это супер успех!')).catch(err => console.log('ууууууу!'));

//Generate random data array
function generateNumb(method = 'uniqint', n, min, max = n){
    n = ~~n;
    let intMn = ~~min;
    let intMx = ~~max;
    const str ="QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
    

    const random = (up = intMx - intMn + 1, down = intMn) => {
        return Math.random() * up + down;
    };

    let foo = {        
        'uniqint': function() {                            
            const uniq = new Set();    
            while(uniq.size < n){
                uniq.add(~~random());
            }    
            return [...uniq];
        },
        'notuniqint': function() {                        
            const arr = [];
            for(let i = 0; i < n; i++){
                arr.push(~~random());
            }
            return arr;
        },
        'uniqfloat': function() {                                           
            const uniq = new Set();    
            while(uniq.size < n){
                uniq.add(random());
            }    
            return [...uniq];
        },
        'notuniqfloat': function(){
            const arr = [];
            for(let i = 0; i < n; i++){
                arr.push(random());
            }
            return arr;
        },
        'notuniqstring': function() {
            const len = str.length - 1;
            const arr = [];
            const tempstr = [];            
            for(let i = 0; i < n; i++) { 
                for(let l = 0; l < intMn; l++) { //generate random string element
                    tempstr[l] = str[~~random(len, 0)]; 
                }
                arr.push(tempstr.join(''));        //add generated string element to array
            }
            return arr;
        }
    };
    return foo[method]();
}


function selectionSort(arr){
    let len  = arr.length;
    for (let i = 0, min; i < len - 1; i++) { 
        min = i;                                
        for (let j = i + 1; j < len; j++) {
            if(arr[j] < arr[min]){ 
                min = j;
            }                        
        }
        if(min != i){
            [arr[i], arr[min]] = [arr[min], arr[i]];
        }        
    }
    console.log('selelectSort', arr);
}

function doubleSelectionSort(arr){
    let len = arr.length;
    let min, max;    
    for(let start = 0, end = len - 1; start < end; start++, end--){        
        min = max = start;

        for(let j = start + 1; j <= end; j++){
            if(arr[j] < arr[min]){
                min = j;
            }else if(arr[j] > arr[max]) {
                max = j;
            }
        }
        
        if((min != start) || (max != end)){
            if(max == start){
                max = min;        
            }
            [arr[min], arr[start]] = [arr[start], arr[min]];
            [arr[max], arr[end]] = [arr[end], arr[max]];
        }
    }
    console.log('doubleSelectionSort:', arr);
}

function bubbleSort(arr) {    
    for (let len = arr.length - 1; len > 0; len--) {
        for (let i = 0; i < len; i++) {
            if(arr[i] > arr[i + 1]){
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
            }
        }
    }
    console.log('bubbleSort',arr);
}

function insertSort(arr) {
    let len = arr.length;
    for (let i = 1; i < len; i++) {
        for (let j = i, prev = i - 1; arr[j] < arr[prev] && j > 0; j--, prev--) {
            [arr[j], arr[prev]] = [arr[prev], arr[j]];
        }
    }
    console.log('isertSort', arr);
}

function shellSort(arr, hCallback) {
    let len = arr.length;  

    const step = (ss) => {        
        return ~~hCallback(ss) || 1;
    };
    return function sort(n = step(len)) {        
        for (let i = n; i < len; i++){
            for(let b = i, s = i - n; s >= 0 && arr[b] < arr[s];){                                
                [arr[b], arr[s]] = [arr[s], arr[b]];
                b = s;
                s -= n;
            }
        }
        if (n > 1){
           return sort(step(n));
        }
            console.log('shellSort', arr);
    };
}

let arr = generateNumb('uniqint', 100000, 1);
const sSort = shellSort([...arr], len => len/2);

Promise.resolve()
.then(() => new Promise(resolve => {
    let sst = Date.now();
    selectionSort([...arr]);
    sst = Date.now() - sst;
    console.log('Время:', sst);
    resolve();
}))
.then(() => new Promise(resolve => {
    let sst = Date.now();
    bubbleSort([...arr]);
    sst = Date.now() - sst;
    console.log('Время:', sst);
    resolve();
}))
.then(() => new Promise(resolve => {
    let sst = Date.now();
    insertSort([...arr]);
    sst = Date.now() - sst;
    console.log('Время:', sst);
    resolve();
}))
.then(() => new Promise(resolve => {
    let sst = Date.now();
    sSort();
    sst = Date.now() - sst;
    console.log('Время:', sst);
    resolve();
}))
.then(() => new Promise(resolve => {
    let sst = Date.now();
    arr.sort((a, b) => {
        if(a > b){
            return 1;
        }else if(a < b){
            return -1;            
        }else{
            return 0;
        }
    });
    sst = Date.now() - sst;
    console.log('Nativesort:', arr);
    console.log('Время:', sst);
    resolve();
}))
.then(() => new Promise(resolve => {
    let sst = Date.now();
    doubleSelectionSort([...arr]);
    sst = Date.now() - sst;
    console.log('Время:', sst);
    resolve();
}))
.catch(err => console.log(err));



function binAdd(m, n) {
    const arr = [0,0,0,0,0,0,0,0,0];   
    const cash = [0,0,0,0,0,0,0,0,0];        
    let flag = false;

    for(let i = 8; i >= 0; i--){
        if(n[i] && m[i]) {              //1 and 1
            if(!flag){ flag = true; }   //flag true (digit carry the high-order position)
            cash[i-1] = 1;              //add digit to high-order position
            arr[i] = 0;                 //result = 0
        } else { 
            arr[i] = +!!(m[i] + n[i]);  //else result = 0 + 1 or 0 + 0           
        }
    }
    if(flag){                           
        return binAdd(arr, cash);
    } else {
        return arr;
    }
}

let b = binAdd([0,0,1,1,1,1,1,1,1], [0,1,1,1,1,1,0,1,1]);
console.log(b);


function binAdd2(m, n) {
    const arr = [...m];   
    let j = 0;    
    for (let i = 8; i >= 0; i--) {        
        j = i;        
        while (n[i] + arr[j] > 1) {
            arr[j] = 0;
            j--;
        }
        arr[j] = +!!(arr[j] + n[i]);
    }
    return arr;
}

console.log(binAdd2([0,0,0,0,0,0,0,0,1], [0,1,1,1,1,1,0,1,1]));

function binAdd3(m, n){    
    const arr = [0,0,0,0,0,0,0,0,0];
    for (let i = 8; i >= 0; i--) {           
        if(m[i] && n[i]){
            arr[i-1] = 1;                        
            continue; 
        } 
        if((m[i] || n[i])){
            if(arr[i]){
                arr[i-1] = 1;
                arr[i] = 0;
            }else{
                arr[i] = 1;
            }           
        }        
    }
    return arr;
}

console.log(binAdd3([0,0,0,0,0,0,0,0,1], [0,1,1,1,1,1,0,1,1]));



//Robot paths
let matrA = [
	
	[0, 0, 0, 0], 
	[0, 0, 0, 0], 
	[0, 0, 0, 0],
	[0, 0, 0, 0]	
];

let matrB = [
	
	[0, 0, 0, 0], 
	[0, 0, 0, 0], 
	[0, 0, 0, 0],
	[0, 0, 0, 0]	
];

function pathsA(n, m){
	matrA[n][m]++;
	if(m < 3){
		pathsA(n, m + 1);
	}
	if(n < 3){
		pathsA(n + 1, m);
	}
}
    //2 * m * n
function pathsB(n){
	for(let x = 0; x < n; x++){
		for(let y = 0; y < n; y++){
			if(x && y){ 
				matrB[x][y] =  matrB[x][y-1] + matrB[x-1][y];
			} else {
				matrB[x][y] = 1;
			}
		}
	}	
}

pathsA(0,0);
pathsB(4);
console.log(matrA, matrB);

//when the warm day cams
    // n*n/2 
const temp = [2,1,0,22,-1,24,11,30];

function warmestDay(temp){
	const result =[];
	const len = temp.length;

	for(let i = 0; i < len; i++){
		for(let j = i + 1; j < len; j++){
			if(temp[j] > temp[i]){
				result.push(j - i);
				break;
			}
		}
	}	
	console.log(result);
}

warmestDay(temp);




const myList = new Llist();
myList.unshift(1, 2, 3, 4, 5);


console.log(...myList);


console.log(myList.showList(),'\n', myList.length);

let i = 0;
while(myList.length > 0) {
    console.log(myList.pop());
    ++i;
    myList.getHead();
}

myList.push(1);

console.log(myList.shift(), `length: ${myList.length}`);

//=========================================================


const obj = {
    name: 'John',
    age: 30,
    isMarried: false,
    [Symbol.toPrimitive](hint) {
        switch (hint) {
            case 'number':
                return this.age;
            case 'string':
                return `${this.name} is ${this.age} years old. Is he married? ${this.isMarried}`;
            case 'default':
                return this.name;                
        }
    },

    toString() {
        return this[Symbol.toPrimitive]('string');
    }
};

//visa







