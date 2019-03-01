<a name="Keys"></a>

## Keys
Use this class to create a new instance of the key generator.  The cache
size determines how many UUID keys will be kept in a cache when this
object is instantiated.  When key retrievals exceed this value, then the
cache is regenerated with a new set of values for that instance to choose
from.  The overall "key list" is maintained.

## Examples:

```javascript
import {Keys} from 'util.keys';

const _keys = new Keys({testing: false, cacheSize: 5});
let _key;

_key = _keys.at(0);   // retrieve the key at index 0
_key = _keys.at(1);   // retrieve the key at index 1
_key = _keys.at(-99); // retrieve the key at index 0
```

A key object can be created with testing keys.  the instance is created with
by setting the testing flag option:

```javascript
import {Keys} from 'util.keys';

const _keys = new Keys({testing: true, testingPrefix: 't'});  // true enables testing
let _key
_key = _keys.at(0);   // echos the index back "t0"
_key = _keys.at(1);   // echos the index back "t1"
_key = _keys.at(-99); // echos the default index of "t0"
```

**Kind**: global class  

* [Keys](#Keys)
    * [.at(idx)](#Keys+at) ⇒ <code>string</code>
    * [.next()](#Keys+next) ⇒ <code>string</code>

<a name="Keys+at"></a>

### keys.at(idx) ⇒ <code>string</code>
Retrieve a key at the given index number.  The same index will always
return the same generated key.  The index can be any number > 0. Keys
less then 0 are set to 0.

**Kind**: instance method of [<code>Keys</code>](#Keys)  
**Returns**: <code>string</code> - a UUID associated with that position  
**Params**

- idx <code>number</code> - the unique position id associated with a key (index)

<a name="Keys+next"></a>

### keys.next() ⇒ <code>string</code>
A convenience method to get the key at the next possible index value.
If no key has been retrieved before the first index is 0.  The lastID
is always set to the largest size index ever encountered.

**Kind**: instance method of [<code>Keys</code>](#Keys)  
**Returns**: <code>string</code> - a UUID associated with that position  
