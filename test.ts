'use strict';

import test from 'ava';
import {regexUUID} from 'util.toolbox';
import {Keys} from './index';

test('Test creation of a Keys object', t => {
	const key = new Keys();

	t.truthy(key);
	t.is(key.values.length, 0);
	t.is(key.cacheSize, 25);
});

test('Test retrieval of keys from the object', t => {
	const size = 5;
	const key = new Keys(size);

	t.truthy(key);
	t.is(key.values.length, 0);
	t.is(key.cacheSize, size);

	for (let i = 0; i < size; i++) {
		const val = key.at(i);
		t.regex(val, regexUUID);
		console.log(`val: ${val}`);
	}

	t.is(key.values.length, size);
	console.log(key.values);

	console.log(`val@99: ${key.at(99)}`);
	t.is(key.values.length, size + 1);
	console.log(key.values);
});

test('Test retrieving the same value over and over', t => {
	const key = new Keys(5);

	t.truthy(key);
	t.is(key.values.length, 0);
	t.is(key.cacheSize, 5);

	const val1 = key.at(0);
	t.regex(val1, regexUUID);

	for (let i = 0; i < 20; i++) {
		const val2 = key.at(0);
		t.regex(val2, regexUUID);
		t.is(val1, val2);
		t.is(key.values.length, 1); // size should not change
	}
});

test('Test with small cache size, but large number of keys', t => {
	const maxKeys = 100;
	const size = 5;
	const key = new Keys(size);

	t.truthy(key);
	t.is(key.values.length, 0);
	t.is(key.cacheSize, size);

	for (let i = 0; i < maxKeys; i++) {
		t.regex(key.at(i), regexUUID);
	}

	t.is(key.values.length, maxKeys);
});
