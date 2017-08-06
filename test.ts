'use strict';

import test from 'ava';
import {regexUUID} from 'util.toolbox';
import {Keys} from './index';

test('Test creation of a Keys object', t => {
	const keys = new Keys();

	t.truthy(keys);
	t.is(keys.values.length, 0);
	t.is(keys.cacheSize, 25);
});

test('Test retrieval of keys from the object', t => {
	const size = 5;
	const keys = new Keys(size);

	t.truthy(keys);
	t.is(keys.values.length, 0);
	t.is(keys.cacheSize, size);

	for (let i = 0; i < size; i++) {
		const val = keys.at(i);
		t.regex(val, regexUUID);
		console.log(`val: ${val}`);
	}

	t.is(keys.values.length, size);
	console.log(keys.values);

	console.log(`val@99: ${keys.at(99)}`);
	t.is(keys.values.length, size + 1);
	console.log(keys.values);
});

test('Test retrieving the same value over and over', t => {
	const keys = new Keys(5);

	t.truthy(keys);
	t.is(keys.values.length, 0);
	t.is(keys.cacheSize, 5);

	const val1 = keys.at(0);
	t.regex(val1, regexUUID);

	for (let i = 0; i < 20; i++) {
		const val2 = keys.at(0);
		t.regex(val2, regexUUID);
		t.is(val1, val2);
		t.is(keys.values.length, 1); // size should not change
	}
});

test('Test with small cache size, but large number of keys', t => {
	const maxKeys = 100;
	const size = 5;
	const keys = new Keys(size);

	t.truthy(keys);
	t.is(keys.values.length, 0);
	t.is(keys.cacheSize, size);

	for (let i = 0; i < maxKeys; i++) {
		t.regex(keys.at(i), regexUUID);
	}

	t.is(keys.values.length, maxKeys);
});

test('Test with a key that is less than 0', t => {
	const keys = new Keys();

	t.truthy(keys);
	t.is(keys.values.length, 0);

	const key = keys.at(0);
	t.regex(key, regexUUID);

	const bad = keys.at(-99);
	t.regex(bad, regexUUID);
	t.is(key, bad);
});
