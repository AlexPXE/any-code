"use strict";

import {DLList} from '../src/js/datastructures/llist.js'
// @ts-ignore
import test from 'ava';


test.serial('Test DLList', t => {
    const list = new DLList();
    const initialArr = [1, 2, 3, 4, 5, 6, 7];
    const amountOfElements = 10_000_000;

    const reduceToArrayCb = (acc, value) => {
        acc.push(value);
        return acc;
    }  

    const reduceToNumberCb = (acc, value) => {
        return acc + value;
    };

    t.deepEqual([...list.slice()], []);
    t.deepEqual([...list.slice(100, 123)], []);

    let startTime = performance.now();
    for(let i = 0; i < amountOfElements; i++) {
        list.push(i);
    }
    t.log(`Adding ${amountOfElements} numbers: ${(performance.now() - startTime) / 1000}s`);


    t.is       ( list.slice(-10_000_000).getLength(),   10_000_000 );
    t.is       ( list.slice().getLength(),              10_000_000);
    t.deepEqual( [...list.slice(500, 505)],             [500, 501, 502, 503, 504, 505] );
    t.deepEqual( [...list.slice(505, 500)],             505, 504, 503, 502, 501, 500] );
    t.deepEqual( [...list.slice(-1, -3)],               [9_999_999, 9_999_998, 9_999_997] );
    t.deepEqual( [...list.slice(-3, -1)],               [9_999_997, 9_999_998, 9_999_999] );
    t.deepEqual( [...list.slice(-1, -3)],               [9_999_999, 9_999_998, 9_999_997] );
    t.deepEqual( [...list.slice(9_999_999, -3)],        [9_999_999, 9_999_998, 9_999_997] );
    t.deepEqual( [...list.slice(-3, 9_999_999)],        [9_999_997, 9_999_998, 9_999_999] );
    t.deepEqual( [...list.slice(2, 2)], [2] );    
    t.deepEqual( [...list.slice(10_000_000)],           [] );
    t.deepEqual( [...list.slice(null, null)],           [] );
    t.deepEqual( [...list.slice(NaN, NaN)],             [] );
    t.deepEqual( [...list.slice(undefined, undefined)], [] );
    t.deepEqual( [...list.slice(NaN, null)],            [] );
    t.deepEqual( [...list.slice(null, NaN)],            [] );
    t.deepEqual( [...list.slice(undefined, NaN)],       [] );
    t.deepEqual( [...list.slice(NaN, undefined)],       [] );
    t.deepEqual( [...list.slice(undefined, null)],      [] );
    t.deepEqual( [...list.slice(null, undefined)],      [] );
    t.deepEqual( [...list.slice(null, 20)],             [] );
    t.deepEqual( [...list.slice(NaN, 20)],              [] );
    t.deepEqual( [...list.slice(undefined, 20)],        [] );
    t.deepEqual( [...list.slice(9_999_997, undefined)], [] );
    t.deepEqual( [...list.slice(9_999_997, NaN)],       [] );
    t.deepEqual( [...list.slice(9_999_997, null)],      [] );
    t.deepEqual( [...list.slice(0.432, 10.2345)],       [] );
    t.deepEqual( [...list.slice(0.678, 13.1001)],       [] );
    
    
    t.is        ( list.getLength(),                     amountOfElements );
    t.is        ( list.getByIndex(4_599_888),           4_599_888);

    startTime = performance.now();
    t.is       ( list.find(v => v === 4_599_888),       4_599_888 );
    t.log      ( `Finding an element: ${ (performance.now() - startTime) / 1000 }s`);
    t.is       ( list.delByIndex(4_599_888),            true );
    t.is       ( list.find(v => v === 4_599_888),       null );
    t.is       ( list.deleteByValue(4_599_887),         true );
    t.is       ( list.find(v => v === 4_599_887),       null );
    t.is       ( list.getLength(),                      9_999_998 );
    

   list.destroy()
       .push(1)
       .push(2)
       .push(3)
       .push(4)
       .push(5)
       .push(6)
       .push(7);
    
    t.is         ( list.getLength(),                          initialArr.length,       `List length must be ${initialArr.length}` );
    t.deepEqual  ( list.reduce(reduceToArrayCb, []),          initialArr,              `Method DLList#reduce() must return identical to the original array: [${initialArr}]` );
    t.is         ( list.reduce(reduceToNumberCb),             initialArr.reduce(reduceToNumberCb), `The result of the DLList#reduce() method must be equal to the result of Array#reduce()`);
    t.is         ( list.find(v => 1 === v),                    1 );
    t.is         ( list.find(v => 7 === v),                    7 );
    t.is         ( list.find(v => 11 === v),                   null );    
    t.is         ( list.find(v => 0 === v),                    null );    
    t.is         ( list.pop(),                                 7 );
    t.is         ( list.pop(),                                 6 );
    t.is         ( list.pop(),                                 5 );
    t.is         ( list.getLength(),                           4 );
    t.is         ( list.pop(),                                 4 );
    t.is         ( list.pop(),                                 3 );
    t.is         ( list.pop(),                                 2 );
    t.is         ( list.pop(),                                 1 );
    t.is         ( list.pop(),                                 null );
    t.is         ( list.getLength(),                           0, `List length must be 0` );
    t.is         ( list.find(v => 20 === v),                   null );

    list.push(1)
        .push(2)
        .push(3)
        .push(4)
        .push(5)
        .push(6)
        .push(7);
    

    t.is        ( list.swap(v => v === 6, v => v === 2),        true );
    t.deepEqual ( list.reduce(reduceToArrayCb, []),             [1, 6, 3, 4, 5, 2, 7] );
    t.is        ( list.swap(v => v === 6, v => v === 2),        true );
    t.deepEqual ( list.reduce(reduceToArrayCb, []),             [1, 2, 3, 4, 5, 6, 7] );
    t.is        ( list.swap(v => v === 123, v => v === 2),      false );
    t.is        ( list.getLength(),                             7 );
    t.is        ( list.delete(v => v === 3),                    true );
    t.is        ( list.delete(v => v === 9),                    false );
    t.is        ( list.getLength(),                             6 );
    t.deepEqual ( list.reduce(reduceToArrayCb, []),             [1, 2, 4, 5, 6, 7] );
    t.is        ( list.deleteByValue(5),                        true );
    t.is        ( list.getLength(),                             5 );
    t.is        ( list.unshift(5).getLength(),                  6 );
    t.deepEqual ( list.reduce(reduceToArrayCb, []),             [5, 1, 2, 4, 6, 7] );
    t.is        ( list.shift(),                                 5 );
    t.is        ( list.getLength(),                             5 );
    t.deepEqual ( list.reduce(reduceToArrayCb, []),             [1, 2, 4, 6, 7] );    
    t.is        ( list.reduce(reduceToNumberCb),                [1, 2, 4, 6, 7].reduce(reduceToNumberCb) );

    t.is        ( list.getByIndex(4),                           7 );
    t.is        ( list.getByIndex(0),                           1 );
    t.is        ( list.getByIndex(2),                           4 );    
    t.is        ( list.getByIndex(123),                         null );
    t.is        ( list.getByIndex(-100),                        null );
    t.is        ( list.getByIndex(NaN),                         null );
    t.is        ( list.getByIndex(undefined),                   null );
    t.is        ( list.getByIndex(),                            null );
    t.is        ( list.getByIndex(null),                        null );
    t.is        ( list.delByIndex(null),                        false );
    t.is        ( list.delByIndex(undefined),                   false );
    t.is        ( list.delByIndex(NaN),                         false );
    t.is        ( list.delByIndex({}),                          false );
    t.is        ( list.delByIndex(-1),                          false );
    t.is        ( list.delByIndex([], 1, 3),                    false );
    t.is        ( list.getLength(),                             5 );
    t.is        ( list.delByIndex(3),                           true );
    t.is        ( list.delByIndex(3),                           true );
    t.is        ( list.delByIndex(2),                           true );
    t.is        ( list.delByIndex(1),                           true );
    t.is        ( list.delByIndex(0),                           true );
    t.is        ( list.delByIndex(0),                           false );
    t.is        ( list.getLength(),                             0 );
    t.is        ( list.getByIndex(0),                           null );
    t.is        ( list.getByIndex(3),                           null );

});