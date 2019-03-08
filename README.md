# util.keys

> Maintains a set of unique keys generated for a react component

[![build](https://circleci.com/gh/jmquigley/util.keys/tree/master.svg?style=shield)](https://circleci.com/gh/jmquigley/util.keys/tree/master)
[![analysis](https://img.shields.io/badge/analysis-tslint-9cf.svg)](https://palantir.github.io/tslint/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![testing](https://img.shields.io/badge/testing-jest-blue.svg)](https://facebook.github.io/jest/)
[![NPM](https://img.shields.io/npm/v/util.keys.svg)](https://www.npmjs.com/package/util.keys)
[![coverage](https://coveralls.io/repos/github/jmquigley/util.keys/badge.svg?branch=master)](https://coveralls.io/github/jmquigley/util.keys?branch=master)


## Installation

This module uses [yarn](https://yarnpkg.com/en/) to manage dependencies and run scripts for development.

To install as an application dependency:
```
$ yarn add --dev util.keys
```

To build the app and run all tests:
```
$ yarn run all
```


## Overview

The use case for this module is to generate unique keys used by a React control that will be in an array.  This associates a UUID to each index of the array.  Separate instances of the same control can then use their index positions to associated a unique id that will not collide between instances.  This is to avoid using the array index as the unique key for a control.


## Usage

#### Basic

```javascript
import * as React from 'react';
import {Keys} from 'util.keys';

export class Foo extends React.Component<P, S> {
	private _keys = new Keys();

	constructor(props: any) {
		super(props);
	}

	render() {
		let controls = [];
		for (let i=0; i<20; i++) {
			controls.push(
				<div key={this._keys.at(i)}>foo</div>
			);
		}
		return (
			<div>
			{controls}
			</div>
		);
	}
}
```

When `Foo` is rendered the key values associated with each instance in `controls` is a unique UUID instead of the index of the array.  On each re-render of the `controls` array the index values retrieved by `this._keys.at(i)` resolves back to the same UUID for that instance.  If one were to create another instance of `Foo` then it would have its own set of UUID values for each index of its `controls` array.  This ensures unique keys across instances.

The index values given to `.at(idx)` do not need to be sequential.  Any number can be used to retrieve a key.  On retrieval the idx/uuid are paired together for the life of the instance.

A convenience method is also provided to retrieve the *next()* id string available.  It assumes a start of 0 if no previous index was given.

#### Testing

The same basic method is used during testing.  However, when using snapshot testing it is not desirable for the key value to randomly change with each test run.  The control can be configured to produce a stable, predicatble key when the testing flag is set.

```javascript
import * as React from 'react';
import {Keys} from 'util.keys';

export class Foo extends React.Component<P, S> {
	private _keys = new Keys({testing: true, testingPrefix: 't'});

	constructor(props: any) {
		super(props);
	}

	render() {
		let controls = [];
		for (let i=0; i<20; i++) {
			controls.push(
				<div key={this._keys.at(i)}>foo</div>
			);
		}
		return (
			<div>
			{controls}
			</div>
		);
	}
}
```

Each of the component key values will be produced in numeric order starting from 0.  A string can also be prepended to each key.  In this example each key has the string "t" prepended, so the values are "t0, t1, t2...".


## API

- [Key()](docs/index.md#Keys)
- [.at()](docs/index.md#Keys+at)
- [.next()](docs/index.md#Keys+next)

The `Key` class contructor takes an options object for configuration parameters.  It has the following options:

- `cacheSize {number} (25)` - the number of items in the array cache.  The class will preload 25 items by default.
- `testing {boolean} (false)` - when this option is set the id values returned are an echo of the requested index.  This is used for testing (as snapshot testing will not work with this class).
- `testingPrefix: {string} ('')` - when the testing option is set this prefix will be prepended to the index string used for testing.  By default this is an empty string.
