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

const _keys = new Keys(5);
let _key
_key = _keys.at(0);   // retrieve the key at index 0
_key = _keys.at(1);   // retrieve the key at index 1
_key = _keys.at(-99); // retrieve the key at index 0
```

**Kind**: global class  
<a name="Keys+at"></a>

### keys.at(idx) ⇒ <code>string</code>
Retrieve a key at the given index number.  The same index will always
return the same generated key.  The index can be any number > 0. Keys
less then 0 are set to 0.

**Kind**: instance method of [<code>Keys</code>](#Keys)  
**Returns**: <code>string</code> - a UUID associated with that position  

| Param | Type | Description |
| --- | --- | --- |
| idx | <code>number</code> | the unique position id associated with a key (index) |

