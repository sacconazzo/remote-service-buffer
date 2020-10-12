# remote-service-buffer

Buffering result from external fetchAPI, updating only when needed.

## Why

If you need to call a fetchAPI more times but you do not want to overload the API server.

You can execute Service more times. Service makes one single call each 5 minutes (default, you can change it), and returns a buffer.
If you do not execute Service, it not makes calls to server.

Service is faster. When You execute Service, it first returns a buffer, then performs the buffer update later.

## Installation

```npm
npm install remote-service-buffer
```

## Example

Calling the same service each second. Service buffers the result and returns it. Service updates buffer after 10 seconds (each 10 seconds if needed).

```js
import service from "remote-service-buffer"

const fetchHeaders = {} //optional

const refreshTime = 1000 * 10 //optional (default is 5 mins)

const myService = new service("http://worldtimeapi.org/api", "/ip", refreshTime, fetchHeaders)

async function loop() {
  console.log(await myService.get())
  setTimeout(loop, 1000)
}
loop()
```

## Refs

https://www.npmjs.com/package/remote-service-buffer
