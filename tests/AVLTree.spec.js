
import { AVLTreeUK, AVLTreeNonUK  } from '../src/js/datastructures/bst.js';
import { isVoid } from '../src/js/utility/utility.js';

// @ts-ignore
import test from 'ava';


test.skip('AVLTreeUK', t => {
	const tree = new AVLTreeUK((key, data) => {
		if(key > data) {
			return 1;
		}

		if(key < data) {
			return -1;
		}

		return 0;
	})
	.create();
	
	
	const reduceCbForNumbers = (acc, value) => {
		acc.push(value);
		return acc;
	};

	const arr = [];

	

	for(let i = 0; i < 10; i++) {
		tree.insert(i);
		arr.push(i);
	}

	t.deepEqual( tree.reduce(reduceCbForNumbers, []), arr );
	t.is( tree.find(5), 5 );
	t.true( tree.delete(5) );
	t.false( tree.delete(5) );	
	t.deepEqual( tree.insert(1).reduce(reduceCbForNumbers, []), arr.filter(v => v !== 5));
	
	tree.destroy();

	const start = performance.now();

	for(let i = 0; i < 10_000_000; i++) {
		tree.insert(i);	
	}

	t.log(`${(performance.now() - start) / 1000}`)

	t.is(tree.find(9_843_546), 9_843_546);
});


test.serial('AVLTreeNonUK', t => {
	const reduceCbForNumbers = (acc, value) => {
		acc.push(value);
		return acc;
	};
	const arr = [1, 1, 1, 3, 3, 4, 7, 7, 8, 10, 10];
	const tree = new AVLTreeNonUK((key, data) => {
		if(key > data) {
			return 1;
		}

		if(key < data) {
			return -1;
		}

		return 0;
	})
	.create();

	tree.insert(10)
		.insert(10)
		.insert(1)
		.insert(1)
		.insert(1)
		.insert(7)
		.insert(8)
		.insert(7)
		.insert(3)
		.insert(4)
		.insert(3);
		t.is(tree.find(4), 4);
		t.is(tree.find(8), 8);

		t.log(`${tree.reduce(reduceCbForNumbers, [])}`);
});