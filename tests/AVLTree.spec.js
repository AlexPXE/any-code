
import { AVLTree } from '../src/js/datastructures/bst.js';
import { isVoid } from '../src/js/utility/utility.js';

// @ts-ignore
import test from 'ava';

const INSERT_SPEED_TEST_TIME = 9;
const AMOUNT_OF_ELEMENTS = 10_000_000;
const SEARCH_NUMBER = 9_333_123;



//callback for find method in AVLTree.
const predicateF = k => {
	if(SEARCH_NUMBER === k) {
		return 0;
	}
	if(SEARCH_NUMBER < k) {
		return -1;
	}
	return 1;
};

const strGen = (() => {
	const alphabet = "abcdefghijklmnopqrstuvwxyz123456789";
	return () => {
		let str = "";
		for(let i = 0; i < 10; i++) {
			str += alphabet[Math.floor(Math.random() * alphabet.length)];
		}		
		return str;
	};
})();

test.skip("Test AVLTree (iswert() and find() methods.)", t => {

	testMethods({
		obj: new AVLTree(),
		Filler: strGen,
		insert: {
			iName: "insert"
		}, 						
		searchMethod: {
			fName: "find",
			predicate: key => {
				const str = key.match(/^\w\w/)[0];
				if(str === 'ab') {
					console.log(key);
					return 0;
				}
				if(str > 'ab') {
					return -1;
				}
				return 1;
			},							
			serchValue: null,
			expectedResult: 'ab',
			searchResultHandler: res => res && res.match(/^\w\w/)[0],
		},		
	}, t);
});

test.skip("Test Array (push() and find() methods.)", t => {

	testMethods({
		obj: [],
		Filler: strGen,
		insert: {
			iName: "push"
		}, 						
		searchMethod: {
			fName: "find",
			predicate: key => key === 'abstd2dax4',
			searchResultHandler: res => res,
			serchValue: null,
			expectedResult: 'abstd2dax4',
		},
	}, t);
});

test.skip('Test Map (set() and get() methods.)', t => {
	testMethods({
		obj: {
			map: new Map(),
			node: strGen,
			insert: function () {
				this.map.set( this.node(), this.node() );
			},

			find: function(key) {
				return this.map.get(key);
			}			
		},
		insert: {
			iName: "insert",			
		}, 						
		searchMethod: {
			fName: "find",
			predicate: null,
			serchValue: 'abstd2dax4',
			searchResultHandler: res => res,			
			expectedResult: 'abstd2dax4'
		}		
	}, t);
});


test.skip('Test Set (add() method and sech value)', t => {
	testMethods({
		obj: {
			set: new Set(),
			node: strGen,
			insert: function () {
				this.set.add(this.node());
			},
			find: function (key) {
				for(let k of this.set) {
					if(k === key) {
						return k;
					}
				}
				return null;
			}
		},
		insert: {
			iName: "insert",			
		}, 						
		searchMethod: {
			fName: "find",
			predicate: null,
			serchValue: 'abstd2dax4',
			searchResultHandler: res => res,
			expectedResult: 'abstd2dax4'
		}		
	}, t);
});

test.serial("Test AVLTree (remove, reduce  methods)", t => {
	const tree = new AVLTree();
	
	const ammount = 30;
	const existingValue = ~~(ammount / 2);	
	const nonExistentValue = ammount;
	const initialArr = [];

	function delCbFactory(value) {
		return data => {
			if (value < data) {
				return -1;
			}
			if (value > data) {
				return 1;
			}
			return 0;
		};
	}	

	const reducerCb = (acc, value) => {
		acc.push(value);		
		return acc;
	};

	const reducerCbSum = (acc, value) => {
		return acc + value;
	};

	t.falsy( tree.delete( delCbFactory(nonExistentValue) ),  `Attempt to delete value from empty tree.`);
	
	for(let i = 1; i < ammount; i++) {
		initialArr.push(i);
		tree.insert(i);
	}		
	
	t.log          (`Before removal ${existingValue}: [${initialArr}]`);
	t.is           (tree.reduce(reducerCbSum), initialArr.reduce(reducerCbSum),    `The sum of all array elements must be equal to the sum of all tree elements`);
	t.deepEqual    ( tree.reduce(reducerCb, []), initialArr,                       `Method AVLTree#reduce() must return identical to the original array: [${initialArr}]`);
	t.falsy        ( tree.delete( delCbFactory(nonExistentValue) ),                `Attempt to delete a non-existent value: ${ nonExistentValue }`);
	t.truthy       ( tree.delete( delCbFactory(existingValue) ),                   `Attempt to delete an existing value: ${ existingValue }`);
	t.truthy       ( tree.delete( delCbFactory(1) ),                               `Attempt to remove the number '0'`);
	t.truthy  	   ( tree.delete( delCbFactory(29) ),                              `Attempt to remove the number '29'`);
	t.notDeepEqual ( tree.reduce(reducerCb, []), initialArr,                       `The result must not be the same as the original array: [${initialArr}]`);	
	t.log          (`After removal ${existingValue}: [${tree.reduce(reducerCb, [])}]`);

});



function TestNode(value) {
	this.key = value;
	this.left = null;
	this.right = null;
	this.height = 1;
}

function NodeFabric(NodeClass) {
	return val => {
		return new NodeClass(val);
	};
};

function testMethods({
	obj, 											//test object
	Filler = null,									//function that fills the tree (or array) with random values. If not needed, pass null, then will be used numers from 0 to AMOUNT_OF_ELEMENTS.
	amountOfElements: {
		from,
		to,
	} = {
		from: 0,
		to: AMOUNT_OF_ELEMENTS
	},
	insert: {
		iName = "insert", 							//name of insert method
		insertTimeLimit = INSERT_SPEED_TEST_TIME 	//time limit (in seconds) for insert speed test.
	}, 						
	searchMethod: {
		fName = "find",								//name of find method
		predicate,  								//callback for find method if needed. If not needed, pass null. But then you need to specify the "serchValue" parameter.
		serchValue, 								//value for find method if needed. If not needed, pass null. But then you need to specify the "predicate" parameter.
		expectedResult = SEARCH_NUMBER,				//expected result of find method
		searchResultHandler = res => res,			//handler for search result		
	},
}, t) {

	let insertTime;
	let findTime;
	let foundEl;
	let processedSearchResult;

	if(isVoid(Filler)) {

		insertTime = performance.now();
		for(let i = from; i < to; i++) {    
			obj[iName](i);
		}
		insertTime = (performance.now() - insertTime) / 1000;

	} else {

		insertTime = performance.now();
		for(let i = from; i < to; i++) {    
			obj[iName](Filler(i));
		}
		insertTime = (performance.now() - insertTime) / 1000;
	}

	findTime = performance.now();
	foundEl = obj[fName]( isVoid(predicate) ? serchValue : predicate );
	findTime = (performance.now() - findTime) / 1000;
	
	processedSearchResult = searchResultHandler(foundEl);	
	
	t.assert(
		insertTime < insertTimeLimit, 
		`${insertTime} seconds have passed.`
	)
	t.assert(
		processedSearchResult === expectedResult, 
		`${processedSearchResult} is not equal to ${expectedResult}` 
	)
	t.log(`
		insertion time ${insertTime}s,
		find time: ${findTime}s, 
		search result: ${processedSearchResult},
		expected result: ${expectedResult}
	`);
}
