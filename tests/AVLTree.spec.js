
import { AVLTree } from '../src/js/datastructures/bst.js';
import { isVoid } from '../src/js/utility/utility.js';

// @ts-ignore
import test from 'ava';

const INSERT_SPEED_TEST_TIME = 9;
const AMOUNT_OF_ELEMENTS = 10_000_000;
const SEARCH_ELEMENT = 9_333_123;

//callback for find method in AVLTree.
const predicateF = k => {
	if(SEARCH_ELEMENT === k) {
		return 0;
	}
	if(SEARCH_ELEMENT < k) {
		return -1;
	}
	return 1;
};

function TestNode(value) {
	this.key = value;
	this.left = null;
	this.right = null;
	this.height = 1;
}

function NodeArray(limit = AMOUNT_OF_ELEMENTS) {
	const arr = [];
	for(let i = 0; i < limit; i++) {
		arr.push(new TestNode(i));
	}
	return key => arr[key];
}


const NodeFabric = (NodeClass) => {
	return val => {
		return new NodeClass(val);
	};
};



function testMethods({
	obj, 									//test object
	Filler = null,							//function that fills the tree (or array) with random values. If not needed, pass null, then will be used numers from 0 to AMOUNT_OF_ELEMENTS.
	amountOfElements: {
		from,
		to,
	} = {
		from: 0,
		to: AMOUNT_OF_ELEMENTS
	},
	insert: {
		iName = "insert", 											//name of insert method
		insertTimeLimit = INSERT_SPEED_TEST_TIME 		//time limit (in seconds) for insert speed test.
	}, 						
	searchMethod: {
		fName = "find",								//name of find method
		predicate,  						//callback for find method if needed. If not needed, pass null. But then you need to specify the "serchValue" parameter.
		serchValue, 						//value for find method if needed. If not needed, pass null. But then you need to specify the "predicate" parameter.
		expectedResult = SEARCH_ELEMENT,	//expected result of find method
		searchResultHandler = res => res,	//handler for search result		
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

test.serial("Test AVLTree", t => {

	testMethods({
		obj: new AVLTree(({key: d}, key) => {
			if(key > d) {
				return 1;
			}
			return 0;
		}),

		Filler: NodeArray(),
		insert: {
			iName: "insert"
		}, 						
		searchMethod: {
			fName: "findByKey",				
			predicate: ({key}) => {
				if(key === SEARCH_ELEMENT) {
					return 0;
				}				
				if(key < SEARCH_ELEMENT) {
					return -1;
				}
				return 1;				
			},											
			serchValue: null,
			searchResultHandler: res => res.key,
		},		
	}, t);
});

test.serial("Test Array", t => {

	testMethods({
		obj: [],
		Filler: NodeFabric(TestNode),
		insert: {
			iName: "push"
		}, 						
		searchMethod: {
			fName: "find",
			predicate: n => n.key === SEARCH_ELEMENT,
			searchResultHandler: res => res && res.key,
			serchValue: null,			
		},
	}, t);
});

test.serial('Map', t => {
	testMethods({
		obj: {
			map: new Map(),
			node: NodeFabric(TestNode),
			insert: function (key) {
				this.map.set(key, this.node(key));
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
			serchValue: SEARCH_ELEMENT,
			searchResultHandler: res => res && res.key,			
		}		
	}, t);
});


test.serial('Set', t => {
	testMethods({
		obj: {
			set: new Set(),
			node: NodeFabric(TestNode),
			insert: function (key) {
				this.set.add(this.node(key));
			},
			find: function (key) {
				for(let k of this.set) {
					if(k.key === key) {
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
			serchValue: SEARCH_ELEMENT,
			searchResultHandler: res => res && res.key,			
		}		
	}, t);
});


test.serial('OtherAvl', t => {
	testMethods({
		obj: new AVL(),
		Filler: NodeArray(),
		insert: {
			iName: "insert"
		}, 						
		searchMethod: {
			fName: "find",
			predicate: null,
			serchValue: SEARCH_ELEMENT,
			searchResultHandler: ({key}) => key,
		}		
	}, t);
})

test.todo("Test AVLTree.prototype.remove()");
