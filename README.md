# N Linear Interpolation

Given a set of coordinates with associated values, provide the interpolated value for any compatible coordinate.

Implementation for 1, 2, and 3 dimensions.

## Examples

### 3D

```typescript
import {D3Element, interpolate} from '@mjfcolas/n-linear-interpolation';

//[X, Y, Z, Value]
const arrayWithOneCube: D3Element[] = [
    [0, 0, 700, 315],
    [0, 0, 900, 535],
    [0, 20, 700, 345],
    [0, 20, 900, 590],
    [4000, 0, 700, 415],
    [4000, 0, 900, 720],
    [4000, 20, 700, 460],
    [4000, 20, 900, 800]
];

console.log(interpolate.d3(arrayWithOneCube, [2000, 10, 800]))//522.5;

```

### 2D

```typescript
import {D2Element, interpolate} from '@mjfcolas/n-linear-interpolation';

//[X, Y, Value]
const arrayWithOneSquare: D2Element[] = [
    [0, 0, 315],
    [0, 20, 345],
    [20, 0, 415],
    [20, 20, 460]
];

console.log(interpolate.d2(arrayWithOneSquare, [10, 10]))//390;
```

### 1D

```typescript
import {D1Element, interpolate} from "@mjfcolas/n-linear-interpolation";

//[X, Value]
const arrayWithOneLine: D1Element[] = [
    [0, 315],
    [20, 345]
];

console.log(interpolate.d1(arrayWithOneLine, 10))//330;
```

### Javascript

```javascript
import {interpolate} from "@mjfcolas/n-linear-interpolation";
//or const {interpolate} = require('@mjfcolas/n-linear-interpolation');

//[X, Value]
const arrayWithOneSegment = [
    [0, 315],
    [20, 345]
];

console.log(interpolate.d1(arrayWithOneSegment, 10))//330;
```

## Error Handling

The function will throw an Error with the message `OUT_OF_BOUND_ERROR` if coordinates of the wanted value are outside the range of the provided coordinates.



