'use strict';

const debug = require('debug')('keys.test');

import test from 'ava';
import {regexUUID} from 'util.constants';
import {Keys} from './index';

test('Test creation of a Keys object', t => {
	const keys = new Keys();

	t.truthy(keys);
	t.is(keys.size, 0);
	t.is(keys.cacheSize, 25);
});

test('Test retrieval of keys from the object', t => {
	const size = 5;
	const keys = new Keys({cacheSize: size});

	t.truthy(keys);
	t.is(keys.size, 0);
	t.is(keys.cacheSize, size);

	for (let i = 0; i < size; i++) {
		const val = keys.at(i);
		t.regex(val, regexUUID);
		debug(`val: ${val}`);
	}

	t.is(keys.size, size);
	debug(keys.values);

	debug(`val@99: ${keys.at(99)}`);
	t.is(keys.size, size + 1);
	debug(keys.values);
});

test('Test retrieving the same value over and over', t => {
	const keys = new Keys({cacheSize: 5});

	t.truthy(keys);
	t.is(keys.size, 0);
	t.is(keys.cacheSize, 5);

	const val1 = keys.at(0);
	t.regex(val1, regexUUID);

	for (let i = 0; i < 20; i++) {
		const val2 = keys.at(0);
		t.regex(val2, regexUUID);
		t.is(val1, val2);
		t.is(keys.size, 1); // size should not change
	}
});

test('Test with small cache size, but large number of keys', t => {
	const maxKeys = 100;
	const size = 5;
	const keys = new Keys({cacheSize: size});

	t.truthy(keys);
	t.is(keys.size, 0);
	t.is(keys.cacheSize, size);
	t.false(keys.testing);
	t.is(keys.testingPrefix, '');

	for (let i = 0; i < maxKeys; i++) {
		t.regex(keys.at(i), regexUUID);
	}

	t.is(keys.size, maxKeys);
});

test('Test with a key that is less than 0', t => {
	const keys = new Keys();

	t.truthy(keys);
	t.is(keys.size, 0);
	t.false(keys.testing);
	t.is(keys.testingPrefix, '');

	const key = keys.at(0);
	t.regex(key, regexUUID);

	const bad = keys.at(-99);
	t.regex(bad, regexUUID);
	t.is(key, bad);
});

test('Create keys with the testing flag', t => {
	const keys = new Keys({testing: true});

	t.truthy(keys);
	t.true(keys.testing);
	t.is(keys.testingPrefix, '');

	t.is(keys.at(0), '0');
	t.is(keys.at(1), '1');
	t.is(keys.at(255), '255');
	t.is(keys.at(-1), '0');
	t.is(keys.at(-99), '0');
});

test('Create keys with testing flag and testing prefix', t => {
	const keys = new Keys({testing: true, testingPrefix: 't'});

	t.truthy(keys);
	t.true(keys.testing);
	t.is(keys.testingPrefix, 't');

	t.is(keys.at(0), 't0');
	t.is(keys.at(1), 't1');
	t.is(keys.at(255), 't255');
	t.is(keys.at(-1), 't0');
	t.is(keys.at(-99), 't0');
});

test('Retrieve a value using next()', t => {
	const keys = new Keys();

	t.truthy(keys);
	t.is(keys.size, 0);
	t.is(keys.lastID, -1);

	const key0 = keys.next();
	t.regex(key0, regexUUID);
	t.is(keys.lastID, 0);

	const key1 = keys.next();
	t.regex(key1, regexUUID);
	t.is(keys.lastID, 1);

	t.is(keys.at(0), key0);
	t.is(keys.at(1), key1);
});

test('Retrieve a value using next() after at()', t => {
	const keys = new Keys();

	t.truthy(keys);
	t.is(keys.size, 0);
	t.is(keys.lastID, -1);

	let key = keys.next();
	t.truthy(key);
	t.regex(key, regexUUID);

	key = keys.next();
	t.truthy(key);
	t.regex(key, regexUUID);

	t.is(keys.lastID, 1);

	key = keys.at(55);
	t.truthy(key);
	t.regex(key, regexUUID);
	t.is(keys.lastID, 55);

	key = keys.at(10);
	t.truthy(key);
	t.regex(key, regexUUID);
	t.is(keys.lastID, 55);

	key = keys.next();
	t.regex(key, regexUUID);
	t.is(keys.lastID, 56);

	t.is(keys.size, 5);
});
