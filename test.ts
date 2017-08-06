'use strict';

import test from 'ava';
import {Keys} from './index';

test('Test creation of a Keys object', t => {
	const key = new Keys(5);

	t.truthy(key);
	t.is(key.values.length, 0);
	t.is(key.cacheSize, 5);
});
