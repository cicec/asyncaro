# Asyncaro

Manage the execution of async methods

## e.g.

```js
import action from 'asyncaro'

const one = action()
const two = one.next()

one.add(() => fetch('/login'))

// Wait for one to be fully executed
two.add(() => fetch('/profile'))
```
