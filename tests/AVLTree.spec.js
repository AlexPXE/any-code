
import { AVLTree  } from '../src/js/datastructures/bst.js';
import { isVoid } from '../src/js/utility/utility.js';

// @ts-ignore
import test from 'ava';


test.serial('AVLTreeUK', t => {
	const tree = AVLTree.UniqueKeys((key, data) => {
		if(key > data) {
			return 1;
		}

		if(key < data) {
			return -1;
		}

		return 0;
	})();	
	
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

	t.log(`Insertion 10 000 000 numbers: ${(performance.now() - start) / 1000}`);

	t.is(tree.find(9_843_546), 9_843_546);
});

test.serial('AVLTreeNonUK', t => {
	const reduceCbForNumbers = (acc, value) => {
		acc.push(value);
		return acc;
	};

	const randomNumber = (max) => {
		return ~~(Math.random() * max);
	}

	const arr = [1, 1, 1, 3, 3, 4, 7, 7, 8, 10, 10];
	const tree = AVLTree.NonUniqueKeys((key, data) => {
		if(key > data) {
			return 1;
		}

		if(key < data) {
			return -1;
		}

		return 0;
	})();	

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
		t.deepEqual(tree.reduce(reduceCbForNumbers, []), arr);
		t.false(tree.delete(20));
		t.true(tree.delete(10));
		t.true(tree.delete(10));
		t.false(tree.delete(10));
		t.true(tree.delete(1));
		t.true(tree.delete(1));
		t.true(tree.delete(1));
		t.true(tree.delete(3));
		t.true(tree.delete(3));
		t.true(tree.delete(4));
		t.true(tree.delete(7));
		t.true(tree.delete(7));
		t.true(tree.delete(8));
		t.false(tree.delete(3));
		t.deepEqual(tree.reduce(reduceCbForNumbers, []), []);


		const start = performance.now();
		for(let i = 0; i < 10_000_000; i++) {
			tree.insert(randomNumber(90_000));
		}

		t.log(`Insertion 10 000 000 random numbers: ${(performance.now() - start) / 1000}s`);

		t.is( tree.filter(91000, v => true).getLength(), 0, `Filter by non-existent key.` );

		t.log( `Number of occurrences of the number 89321: ${ tree.filter(89321, v => true).getLength() }` );

		tree.destroy();



		function Foo(name, surname) {
			this.name = name;
			this.surname = surname;
		}

		const treeWithObjects = AVLTree.NonUniqueKeys((obj, data) => {
			if(obj.name > data.name) {
				return 1;
			}

			if(obj.name < data.name) {
				return -1;
			}

			return 0;
		})();
		
		treeWithObjects.insert( new Foo('Vint', 'Rasmus') )
						.insert( new Foo('Alex', 'Foot') )
						.insert( new Foo('Alex', 'Don') )
						.insert( new Foo('Alex', 'Don') );
		
		t.deepEqual( treeWithObjects.find({name: 'Vint'}), new Foo('Vint', 'Rasmus') );
		t.is( treeWithObjects.filter({name: 'Alex'}, () => true).getLength(), 3 );
		t.is( treeWithObjects.filter({name: 'Alex'}, data => data.surname === 'Cat').getLength(), 0 );
		t.is( treeWithObjects.filter({name: 'Alex'}, data => data.surname === 'Foot').getLength(), 1 );
		t.is( treeWithObjects.filter({name: 'Alex'}, data => data.surname === 'Don').getLength(), 2 );
		
		t.log(`${treeWithObjects.reduce((acc, {name, surname}) => {
			acc.push( [name, surname] );
			return acc;
		}, [])}`)

});