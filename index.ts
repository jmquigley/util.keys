import "util.string";
import {getUUID} from "util.toolbox";

export interface Key {
	[key: number]: string;
}

export interface KeyOptions {
	cacheSize?: number;
	testing?: boolean;
	testingPrefix?: string;
}

export type KeyIndex = number | string;

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
 * const _keys = new Keys({testing: false, cacheSize: 5});
 * let _key;
 *
 * _key = _keys.at(0);                 // retrieve the key at index 0
 * _key = _keys.at(1);                 // retrieve the key at index 1
 * _key = _keys.at(-99); 			   // retrieve the key at index 0
 * _key = _keys.at("test string 1");   // retrieves a key at a hash index 3161057047
 * ```
 *
 * A key object can be created with testing keys.  the instance is created with
 * by setting the testing flag option:
 *
 * ```javascript
 * import {Keys} from 'util.keys';
 *
 * const _keys = new Keys({testing: true, testingPrefix: 't'});  // true enables testing
 * let _key
 * _key = _keys.at(0);   // echos the index back "t0"
 * _key = _keys.at(1);   // echos the index back "t1"
 * _key = _keys.at(-99); // echos the default index of "t0"
 * ```
 */
export class Keys {
	private _keys: Key = {};
	private _cache: string[] = [];
	private _cachePosition: number = 0;
	private _lastID: number = -1;
	private _opts: KeyOptions = {
		cacheSize: 25,
		testing: false,
		testingPrefix: ""
	};

	constructor(opts: KeyOptions = {}) {
		Object.assign(this._opts, opts);
		this.updateCache();
	}

	get cacheSize(): number {
		return this._opts["cacheSize"];
	}

	get lastID(): number {
		return this._lastID;
	}

	get testing(): boolean {
		return this._opts["testing"];
	}

	get testingPrefix(): string {
		return this._opts["testingPrefix"];
	}

	get values(): string[] {
		return Object.values(this._keys);
	}

	get size(): number {
		return this.values.length;
	}

	/**
	 * Retrieve a key at the given index number.  The same index will always
	 * return the same generated key.  The index can be any number > 0. Keys
	 * less then 0 are set to 0.
	 * @param idx {number|string} the unique position id associated with a key
	 * (index).  This can be a number or a string.  If it is a string, then it
	 * is converted to a hash and used as a number index.
	 * @returns {string} a UUID associated with that position
	 */
	public at(idx: KeyIndex): string {
		idx = this.sanitizeIndex(idx);

		if (idx >= this._lastID) {
			this._lastID = idx;
		}

		if (this._opts["testing"]) {
			return `${this._opts["testingPrefix"]}${idx}`;
		}

		if (!this.contains(idx)) {
			this._keys[idx] = this.getCacheValue();
		}

		return this._keys[idx];
	}

	/**
	 * Checks if the given index is in the current key list.
	 * @param idx {KeyIndex} - the index value to look for in the key
	 * object.
	 * @returns true if the index is in the object otherwise false.
	 */
	public contains(idx: KeyIndex): boolean {
		idx = this.sanitizeIndex(idx);
		return idx in this._keys;
	}

	/**
	 * Retrieves the next UUID from the cache array.  If the cache has been
	 * exhausted, then it is refreshed with new values.
	 * @returns {string} a UUID value from the cache
	 * @private
	 */
	private getCacheValue(): string {
		if (this._cachePosition >= this.cacheSize) {
			this.updateCache();
		}

		return this._cache[this._cachePosition++];
	}

	/**
	 * A convenience method to get the key at the next possible index value.
	 * If no key has been retrieved before the first index is 0.  The lastID
	 * is always set to the largest size index ever encountered.
	 * @returns {string} a UUID associated with that position
	 */
	public next(): string {
		return this.at(++this._lastID);
	}

	/**
	 * The index values in the key object are all numbers.  The input allows
	 * for a number index or a string.  When a text string is given it is
	 * converted to a number hash to be stored in the key object.  This
	 * checks if the input is a string and performs that conversion.
	 * @param idx {KeyIndex} - the index value to sanitize.
	 * @returns a newly sanitized index as a number.
	 */
	private sanitizeIndex(idx: KeyIndex): number {
		if (typeof idx === "string") {
			idx = idx.hashCode();
		}

		if (idx < 0) {
			idx = 0;
		}

		return idx;
	}

	/**
	 * Creates a new set of UUID values in the cache based on the given cache
	 * size.  Also resets the internal position back to zero.
	 * @private
	 */
	private updateCache() {
		for (let i = 0; i < this.cacheSize; i++) {
			this._cache[i] = getUUID();
		}

		this._cachePosition = 0;
	}
}
