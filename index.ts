'use strict';

import {getUUID} from 'util.toolbox';

export interface Key {
	[key: number]: string;
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
 * const _keys = new Keys(5);
 * let _key
 * _key = _keys.at(0);   // retrieve the key at index 0
 * _key = _keys.at(1);   // retrieve the key at index 1
 * _key = _keys.at(-99); // retrieve the key at index 0
 * ```
 */
export class Keys {

	private _keys: Key = {};
	private _cache: string[] = [];
	private _cachePosition: number = 0;
	private _cacheSize: number = 0;

	constructor(cacheSize: number = 25) {
		this._cacheSize = cacheSize;
		this._updateCache();
	}

	get values(): string[] {
		return Object.values(this._keys);
	}

	get cacheSize(): number {
		return this._cacheSize;
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
	public at(idx: number) {

		if (idx < 0) {
			idx = 0;
		}

		if (!(idx in this._keys)) {
			this._keys[idx] = this._getCacheValue();
		}

		return this._keys[idx];
	}
}
