"use strict";

const debug = require("debug")("keys.test");

import {regexUUID} from "util.constants";
import "util.string";
import {Keys} from "./index";

test("Test creation of a Keys object", () => {
	const keys = new Keys();

	expect(keys).toBeDefined();
	expect(keys.size).toBe(0);
	expect(keys.cacheSize).toBe(25);
});

test("Test retrieval of keys from the object", () => {
	const size = 5;
	const keys = new Keys({cacheSize: size});

	expect(keys).toBeDefined();
	expect(keys.size).toBe(0);
	expect(keys.cacheSize).toBe(size);

	for (let i = 0; i < size; i++) {
		const val = keys.at(i);
		expect(val).toMatch(regexUUID);
		debug(`val: ${val}`);
	}

	expect(keys.size).toBe(size);
	debug(keys.values);

	debug(`val@99: ${keys.at(99)}`);
	expect(keys.size).toBe(size + 1);
	debug(keys.values);
});

test("Test retrieving the same value over and over", () => {
	const keys = new Keys({cacheSize: 5});

	expect(keys).toBeDefined();
	expect(keys.size).toBe(0);
	expect(keys.cacheSize).toBe(5);

	const val1 = keys.at(0);
	expect(val1).toMatch(regexUUID);

	for (let i = 0; i < 20; i++) {
		const val2 = keys.at(0);
		expect(val2).toMatch(regexUUID);
		expect(val1).toBe(val2);
		expect(keys.size).toBe(1); // size should not change
	}
});

test("Test with small cache size, but large number of keys", () => {
	const maxKeys = 100;
	const size = 5;
	const keys = new Keys({cacheSize: size});

	expect(keys).toBeDefined();
	expect(keys.size).toBe(0);
	expect(keys.cacheSize).toBe(size);
	expect(keys.testing).toBe(false);
	expect(keys.testingPrefix).toBe("");

	for (let i = 0; i < maxKeys; i++) {
		expect(keys.at(i)).toMatch(regexUUID);
	}

	expect(keys.size).toBe(maxKeys);
});

test("Test with a key thaexpect less than 0", () => {
	const keys = new Keys();

	expect(keys).toBeDefined();
	expect(keys.size).toBe(0);
	expect(keys.testing).toBe(false);
	expect(keys.testingPrefix).toBe("");

	const key = keys.at(0);
	expect(key).toMatch(regexUUID);

	const bad = keys.at(-99);
	expect(bad).toMatch(regexUUID);
	expect(key).toBe(bad);
});

test("Create keys with the testing flag", () => {
	const keys = new Keys({testing: true});

	expect(keys).toBeDefined();
	expect(keys.testing).toBe(true);
	expect(keys.testingPrefix).toBe("");

	expect(keys.at(0)).toBe("0");
	expect(keys.at(1)).toBe("1");
	expect(keys.at(255)).toBe("255");
	expect(keys.at(-1)).toBe("0");
	expect(keys.at(-99)).toBe("0");
});

test("Create keys with testing flag and testing prefix", () => {
	const keys = new Keys({testing: true, testingPrefix: "t"});

	expect(keys).toBeDefined();
	expect(keys.testing).toBe(true);
	expect(keys.testingPrefix).toBe("t");

	expect(keys.at(0)).toBe("t0");
	expect(keys.at(1)).toBe("t1");
	expect(keys.at(255)).toBe("t255");
	expect(keys.at(-1)).toBe("t0");
	expect(keys.at(-99)).toBe("t0");
});

test("Retrieve a value using next()", () => {
	const keys = new Keys();

	expect(keys).toBeDefined();
	expect(keys.size).toBe(0);
	expect(keys.lastID).toBe(-1);

	const key0 = keys.next();
	expect(key0).toMatch(regexUUID);
	expect(keys.lastID).toBe(0);

	const key1 = keys.next();
	expect(key1).toMatch(regexUUID);
	expect(keys.lastID).toBe(1);

	expect(keys.at(0)).toBe(key0);
	expect(keys.at(1)).toBe(key1);
});

test("Retrieve a value using next() after at()", () => {
	const keys = new Keys();

	expect(keys).toBeDefined();
	expect(keys.size).toBe(0);
	expect(keys.lastID).toBe(-1);

	let key = keys.next();
	expect(key).toBeDefined();
	expect(key).toMatch(regexUUID);

	key = keys.next();
	expect(key).toBeDefined();
	expect(key).toMatch(regexUUID);

	expect(keys.lastID).toBe(1);

	key = keys.at(55);
	expect(key).toBeDefined();
	expect(key).toMatch(regexUUID);
	expect(keys.lastID).toBe(55);

	key = keys.at(10);
	expect(key).toBeDefined();
	expect(key).toMatch(regexUUID);
	expect(keys.lastID).toBe(55);

	key = keys.next();
	expect(key).toBeDefined();
	expect(key).toMatch(regexUUID);
	expect(keys.lastID).toBe(56);

	expect(keys.size).toBe(5);
});

test("Retrieve a value using at with a string index to be hashed", () => {
	const keys = new Keys();

	expect(keys).toBeDefined();
	expect(keys.size).toBe(0);
	expect(keys.lastID).toBe(-1);

	const s = "test string 1";
	const hashCode = s.hashCode();
	expect(hashCode).toBe(3161057047);

	const key = keys.at(s);

	expect(key).toBeDefined();
	expect(keys.contains(hashCode)).toBe(true);
	expect(key).toMatch(regexUUID);
});
