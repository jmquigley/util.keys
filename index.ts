'use strict';

import {getUUID} from 'util.toolbox';

export interface Key {
	[key: number]: string;
}

export interface KeyOptions {
	testing?: boolean;
	cacheSize?: number;
}

/**
 * Use this class to create a new instance of the key generator.  The cache
 * size determines how many UUID keys will be kept in a cache when this
 * object is instantiated.  When key retrievals exceed this value, then the
 * cache is regenerated with a new set of values for that instance to choose
 * from.  The overall "key list" is maintained.
 *
 * ## Examples:
 *
 * ```javascript
 * import {Keys} from 'util.keys';
 *
 * const _keys = new Keys(false, 5);
 * let _key
 * _key = _keys.at(0);   // retrieve the key at index 0
 * _key = _keys.at(1);   // retrieve the key at index 1
 * _key = _keys.at(-99); // retrieve the key at index 0
 * ```
 *
 * A key object can be created with testing keys.  the instance is created with
 * by setting the testing flag constructor parameter:
 *
 * ```javascript
 * import {Keys} from 'util.keys';
 *
 * const _keys = new Keys(true);  // true enables testing
 * let _key
 * _key = _keys.at(0);   // echos the index back "0"
 * _key = _keys.at(1);   // echos the index back "1"
 * _key = _keys.at(-99); // echos the default index of "0"
 * ```
 */
export class Keys {

	private _keys: Key = {};
	private _cache: string[] = [];
	private _cachePosition: number = 0;
	private _opts: KeyOptions = {
		cacheSize: 25,
		testing: false
	};

	constructor(opts: KeyOptions = {}) {
		Object.assign(this._opts, opts);
		this._updateCache();
	}

	get values(): string[] {
		return Object.values(this._keys);
	}

	get cacheSize(): number {
		return this._opts['cacheSize'];
	}

	get testing(): boolean {
		return this._opts['testing'];
	}

	/**
	 * Retrieves the next UUID from the cache array.  If the cache has been
	 * exhausted, then it is refreshed with new values.
	 * @returns {string} a UUID value from the cache
	 * @private
	 */
	private _getCacheValue(): string {
		if (this._cachePosition >= this.cacheSize) {
			this._updateCache();
		}

		return this._cache[this._cachePosition++];
	}

	/**
	 * Creates a new set of UUID values in the cache based on the given cache
	 * size.  Also resets the internal position back to zero.
	 * @private
	 */
	private _updateCache() {
		for (let i = 0; i < this.cacheSize; i++) {
			this._cache[i] = getUUID();
		}

		this._cachePosition = 0;
	}

	/**
	 * Retrieve a key at the given index number.  The same index will always
	 * return the same generated key.  The index can be any number > 0. Keys
	 * less then 0 are set to 0.
	 * @param idx {number} the unique position id associated with a key (index)
	 * @returns {string} a UUID associated with that position
	 */
	public at(idx: number): string {

		if (idx < 0) {
			idx = 0;
		}

		if (this._opts['testing']) {
			return String(idx);
		}

		if (!(idx in this._keys)) {
			this._keys[idx] = this._getCacheValue();
		}

		return this._keys[idx];
	}
}
