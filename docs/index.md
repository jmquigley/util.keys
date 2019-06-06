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

_key = _keys.at(0);                 // retrieve the key at index 0
_key = _keys.at(1);                 // retrieve the key at index 1
_key = _keys.at(-99); 			   // retrieve the key at index 0
_key = _keys.at("test string 1");   // retrieves a key at a hash index 3161057047
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
    * [.contains(idx)](#Keys+contains) ⇒
    * [.next()](#Keys+next) ⇒ <code>string</code>
    * [.sanitizeIndex(idx)](#Keys+sanitizeIndex) ⇒

<a name="Keys+at"></a>

### keys.at(idx) ⇒ <code>string</code>
Retrieve a key at the given index number.  The same index will always
return the same generated key.  The index can be any number > 0. Keys
less then 0 are set to 0.

**Kind**: instance method of [<code>Keys</code>](#Keys)  
**Returns**: <code>string</code> - a UUID associated with that position  
**Params**

- idx <code>number</code> | <code>string</code> - the unique position id associated with a key
(index).  This can be a number or a string.  If it is a string, then it
is converted to a hash and used as a number index.

<a name="Keys+contains"></a>

### keys.contains(idx) ⇒
Checks if the given index is in the current key list.

**Kind**: instance method of [<code>Keys</code>](#Keys)  
**Returns**: true if the index is in the object otherwise false.  
**Params**

- idx <code>KeyIndex</code> - the index value to look for in the key
object.

<a name="Keys+next"></a>

### keys.next() ⇒ <code>string</code>
A convenience method to get the key at the next possible index value.
If no key has been retrieved before the first index is 0.  The lastID
is always set to the largest size index ever encountered.

**Kind**: instance method of [<code>Keys</code>](#Keys)  
**Returns**: <code>string</code> - a UUID associated with that position  
<a name="Keys+sanitizeIndex"></a>

### keys.sanitizeIndex(idx) ⇒
The index values in the key object are all numbers.  The input allows
for a number index or a string.  When a text string is given it is
converted to a number hash to be stored in the key object.  This
checks if the input is a string and performs that conversion.

**Kind**: instance method of [<code>Keys</code>](#Keys)  
**Returns**: a newly sanitized index as a number.  
**Params**

- idx <code>KeyIndex</code> - the index value to sanitize.

